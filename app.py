from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import json
import re
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS



BASE_DIR = Path(__file__).resolve().parent.parent
app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")
CORS(app)


import os
import sqlite3
import sys
from werkzeug.utils import secure_filename

# Make project modules importable when app.py is launched from backend/.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "skin_analysis"))
sys.path.insert(0, str(PROJECT_ROOT / "ai_engine"))
from skin_analyzer import analyze_skin_image
from decision_engine import generate_recommendation

DATABASE_PATH = Path(__file__).resolve().parent / "dermasense.db"
UPLOAD_FOLDER = Path(__file__).resolve().parent / "uploads"
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(str(DATABASE_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    with get_db_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL DEFAULT 'Guest',
            age INTEGER,
            skin_type TEXT,
            budget TEXT,
            lifestyle TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS skin_analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER,
            image_path TEXT,
            concern TEXT,
            observations TEXT,
            result_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(profile_id) REFERENCES profiles(id)
        );
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            analysis_id INTEGER,
            title TEXT,
            reason TEXT,
            priority TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

init_database()

@app.post('/api/profile')
def create_profile():
    data = request.get_json(silent=True) or {}
    name = str(data.get('name') or 'Guest').strip()[:100]
    age = data.get('age')
    skin_type = data.get('skinType') or data.get('skin_type') or ''
    budget = data.get('budget') or 'Medium'
    lifestyle = data.get('lifestyle') or []
    if isinstance(lifestyle, list):
        lifestyle_text = ', '.join(str(x) for x in lifestyle)
    else:
        lifestyle_text = str(lifestyle)
    try:
        age_value = int(age) if age not in (None, '') else None
    except (TypeError, ValueError):
        return jsonify({'success': False, 'message': 'Age must be a number'}), 400
    with get_db_connection() as conn:
        cur = conn.execute(
            'INSERT INTO profiles (name, age, skin_type, budget, lifestyle) VALUES (?, ?, ?, ?, ?)',
            (name, age_value, skin_type, budget, lifestyle_text)
        )
        profile_id = cur.lastrowid
    return jsonify({'success': True, 'data': {'id': profile_id, 'name': name}}), 201

@app.post('/api/analyze-skin')
def analyze_skin():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'Image file is required in field "image"'}), 400
    image_file = request.files['image']
    if not image_file.filename:
        return jsonify({'success': False, 'message': 'Please choose an image'}), 400
    allowed = {'jpg', 'jpeg', 'png', 'webp'}
    extension = image_file.filename.rsplit('.', 1)[-1].lower() if '.' in image_file.filename else ''
    if extension not in allowed:
        return jsonify({'success': False, 'message': 'Only JPG, JPEG, PNG and WEBP images are supported'}), 400
    image_file.seek(0, os.SEEK_END)
    size = image_file.tell()
    image_file.seek(0)
    if size > 8 * 1024 * 1024:
        return jsonify({'success': False, 'message': 'Image must be 8 MB or smaller'}), 400
    filename = secure_filename(image_file.filename) or 'skin-image.jpg'
    # Avoid overwriting another upload with the same filename.
    stem, ext = os.path.splitext(filename)
    filename = f"{stem}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}{ext.lower()}"
    image_path = UPLOAD_FOLDER / filename
    image_file.save(str(image_path))

    try:
        result = analyze_skin_image(str(image_path), user_concern=request.form.get('concern'))
    except Exception as exc:
        return jsonify({'success': False, 'message': f'Image analysis failed: {exc}'}), 500

    if not result.get('success'):
        return jsonify({'success': False, 'message': result.get('message', 'Image could not be analyzed'),
                        'image_quality': result.get('image_quality'),
                        'disclaimer': result.get('disclaimer', 'Observations only — not a medical diagnosis.') }), 422

    profile_text = request.form.get('profile', '{}')
    try:
        profile = json.loads(profile_text) if profile_text else {}
    except json.JSONDecodeError:
        profile = {}
    profile = profile if isinstance(profile, dict) else {}
    age = profile.get('age')
    try:
        age_value = int(age) if age not in (None, '') else None
    except (TypeError, ValueError):
        age_value = None
    skin_type = str(profile.get('skinType') or profile.get('skin_type') or 'Normal')
    budget = str(profile.get('budget') or 'Medium')
    lifestyle_value = profile.get('lifestyle') or []
    lifestyle_text = ', '.join(lifestyle_value) if isinstance(lifestyle_value, list) else str(lifestyle_value)
    concern = request.form.get('concern') or str(result.get('user_concern') or 'General Care')
    with get_db_connection() as conn:
        cur = conn.execute(
            'INSERT INTO profiles (name, age, skin_type, budget, lifestyle) VALUES (?, ?, ?, ?, ?)',
            ('Guest', age_value, skin_type, budget, lifestyle_text)
        )
        profile_id = cur.lastrowid
        cur = conn.execute(
            'INSERT INTO skin_analyses (profile_id, image_path, concern, observations, result_json) VALUES (?, ?, ?, ?, ?)',
            (profile_id, str(image_path.relative_to(Path(__file__).resolve().parent)), concern,
             json.dumps(result.get('observations', [])), json.dumps(result))
        )
        analysis_id = cur.lastrowid

    # Translate frontend concern labels to decision-engine labels where possible.
    concern_map = {'Acne / Breakouts': 'acne', 'Uneven Texture': 'texture', 'General Care': 'general care'}
    decision_concern = concern_map.get(concern, concern).lower()
    recommendations = generate_recommendation(
        skin_type=skin_type,
        concern=decision_concern,
        budget=budget,
        lifestyle=lifestyle_text,
        observations=result.get('observations', []),
        weather={}
    )
    with get_db_connection() as conn:
        conn.executemany(
            'INSERT INTO recommendations (analysis_id, title, reason, priority) VALUES (?, ?, ?, ?)',
            [(analysis_id, r.get('title',''), r.get('reason',''), r.get('priority','medium')) for r in recommendations]
        )
    return jsonify({
        'success': True,
        'data': {
            'analysis_id': analysis_id,
            'profile_id': profile_id,
            'image_quality': result.get('image_quality'),
            'observations': result.get('observations', []),
            'visual_concerns': result.get('concerns', []),
            'signals': result.get('signals', {}),
            'recommendations': recommendations,
            'disclaimer': result.get('disclaimer', 'Observations only — not a medical diagnosis.')
        }
    }), 201

@app.get('/api/history')
def get_history():
    profile_id = request.args.get('profile_id')
    with get_db_connection() as conn:
        if profile_id:
            rows = conn.execute('SELECT * FROM skin_analyses WHERE profile_id = ? ORDER BY id DESC', (profile_id,)).fetchall()
        else:
            rows = conn.execute('SELECT * FROM skin_analyses ORDER BY id DESC LIMIT 50').fetchall()
    return jsonify({'success': True, 'data': [dict(row) for row in rows]})



HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Metadata stays local so filtering works even when a store page changes its markup.
# The actual name/image/price/availability are refreshed from the official product page.
CATALOG = [
    {"id":101,"brand":"Cetaphil","name":"Gentle Skin Cleanser 125 ml","category":"Cleanser","budget":"Low","price":"₹499*","skinTypes":["Dry","Normal","Sensitive"],"concerns":["Dryness","Sensitivity","Redness","General Care"],"reason":"Gentle cleanser for dry-to-normal and sensitive skin.","image":"https://www.clickoncare.com/cdn/shop/files/Cetaphil-Gentle-Skin-Cleanser125ml01.jpg?v=1685184569&width=416","url":"https://www.cetaphil.in/products/cleansers/gentle-skin-cleanser/8906005274105.html"},
    {"id":102,"brand":"Cetaphil","name":"Oily Skin Cleanser 250 ml","category":"Cleanser","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Sensitive"],"concerns":["Oiliness","Acne / Breakouts","General Care"],"reason":"Low-lather gel cleanser designed for combination-to-oily sensitive skin.","image":"https://www.toyssam.com/cdn/shop/files/8906005275189_1.png?v=1747483193&width=832","url":"https://www.cetaphil.in/products/cleansers/oily-skin-cleanser/8906005275189.html"},
    {"id":103,"brand":"Cetaphil","name":"Gentle Foaming Cleanser","category":"Cleanser","budget":"Medium","price":"Check live price","skinTypes":["Dry","Normal","Sensitive"],"concerns":["Dryness","Sensitivity","Redness","General Care"],"reason":"Foaming daily cleanser formulated for dry-to-normal sensitive skin.","image":"https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/902811/XJ2JV5KskM-902811_1.jpg","url":"https://www.cetaphil.in/products/cleansers/gentle-foaming-cleanser/3499320010092.html"},
    {"id":104,"brand":"Cetaphil","name":"Gentle Exfoliating SA Cleanser","category":"Cleanser","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Sensitive"],"concerns":["Acne / Breakouts","Oiliness","Uneven Texture","Pigmentation"],"reason":"Exfoliating cleanser listed by Cetaphil for oily, acne-prone and sensitive skin.","image":"https://www.justmylook.com/cdn/shop/files/CET0067.png?v=1749830587","url":"https://www.cetaphil.in/products-3/cetaphil-gentle-exfoliating-sa-cleanser/3499320017275.html"},
    {"id":105,"brand":"Cetaphil","name":"Daily Exfoliating Cleanser","category":"Cleanser","budget":"Medium","price":"Check live price","skinTypes":["Sensitive","Normal","Combination"],"concerns":["Dullness","Uneven Texture","General Care"],"reason":"Daily cleanser with gentle exfoliation for smoother-looking skin.","image":"https://images.apollo247.in/pub/media/catalog/product/C/E/CET0408_1-JULY23_1.jpg","url":"https://www.cetaphil.in/products/cleansers/cetaphil-daily-exfoliating-cleanser/IN_9318637044030.html/"},
    {"id":201,"brand":"Dot & Key","name":"Vitamin C + E Super Bright Sunscreen SPF 50","category":"Sunscreen","budget":"Low","price":"Check live price","skinTypes":["Normal","Dry","Combination","Oily","Sensitive"],"concerns":["Pigmentation","Dullness","General Care"],"reason":"Daily sunscreen from the current Dot & Key range.","image":"https://d1puc9h291tp0h.cloudfront.net/uploads/all/I2opLRY0gFV4g9FAbUnzViE0PW7HGDi7LqIwbc8e.jpg","url":"https://www.dotandkey.com/products/dot-key-vitamin-c-e-spf-50-pa-face-sunscreen-for-glowing-skin-uv-protection-for-dull-skin"},
    {"id":202,"brand":"Dot & Key","name":"Barrier Repair Moisturizer – Ceramides + Hyaluronic Acid","category":"Moisturizer","budget":"Medium","price":"₹336*","skinTypes":["Dry","Sensitive","Combination"],"concerns":["Dryness","Redness","Sensitivity","Uneven Texture"],"reason":"Current official listing: suitable for dry, sensitive and combination skin.","image":"https://www.dotandkey.com/cdn/shop/files/1-_175g.jpg?v=1783515808&width=768","url":"https://www.dotandkey.com/products/dot-key-ceramides-hyaluronic-hydrating-face-cream-i-repairs-skin-barrier-intense-moisturization-sensitive-dry-skin-fragrance-free"},
    {"id":203,"brand":"Dot & Key","name":"Watermelon Cooling Sunscreen SPF 50+","category":"Sunscreen","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Normal"],"concerns":["Oiliness","Pigmentation","Dullness","General Care"],"reason":"Lightweight sunscreen option from the current Dot & Key sunscreen range.","image":"https://www.dotandkey.com/cdn/shop/files/watersunscreen80gm_14edc323-f7f2-432c-8d0c-26444a415e50.jpg?v=1727354626","url":"https://www.dotandkey.com/collections/sunscreen"},
    {"id":301,"brand":"Plum","name":"Green Tea Pore Cleansing Face Wash","category":"Cleanser","budget":"Low","price":"₹288*","skinTypes":["Oily","Combination"],"concerns":["Oiliness","Acne / Breakouts","Uneven Texture"],"reason":"Current Plum listing: formulated for oily, combination and acne-prone skin.","image":"https://m.media-amazon.com/images/I/41AFseafb5L._SL1001_.jpg","url":"https://plumgoodness.com/products/green-tea-pore-cleansing-face-wash"},
    {"id":302,"brand":"Plum","name":"2% Niacinamide & Rice Water Gel Moisturizer","category":"Moisturizer","budget":"Low","price":"₹349*","skinTypes":["Oily","Combination","Normal"],"concerns":["Oiliness","Acne / Breakouts","Dullness","Uneven Texture","General Care"],"reason":"Current Plum listing: lightweight gel moisturizer, especially useful for oily or combination skin.","image":"https://images-static.nykaa.com/media/catalog/product/2/2/221592aPLUMX00000641_01.jpg","url":"https://plumgoodness.com/products/2-niacinamide-rice-water-brightening-gel-moisturizer-25-g"},
    {"id":303,"brand":"Plum","name":"2% Niacinamide & Rice Water SPF 50 Sunscreen","category":"Sunscreen","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Normal","Dry"],"concerns":["Acne / Breakouts","Pigmentation","Dullness","Oiliness","General Care"],"reason":"Current Plum sunscreen listing with niacinamide and rice water.","image":"https://plumgoodness.com/cdn/shop/files/Nia-SPF-80g_Amazon_1001x1001_02_42ffb381-f67e-4c20-845d-f33878b8a081.jpg?v=1756375215&width=900","url":"https://plumgoodness.com/products/plum-2-niacinamide-rice-water-spf-50-pa-sunscreen-reduces-blemishes-brightens-skin-protects-from-uva-uvb-rays-fragrance-free-all-skin-types"},
    {"id":401,"brand":"The Derma Co","name":"1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++","category":"Sunscreen","budget":"Medium","price":"₹439*","skinTypes":["Oily","Dry","Normal","Combination"],"concerns":["Dryness","Acne / Breakouts","Pigmentation","Dullness","General Care"],"reason":"Current official listing: lightweight SPF 50 PA++++ gel for all skin types.","image":"https://www.bbassets.com/media/uploads/p/l/1200010309_2-the-derma-co-1-hyaluronic-sunscreen-aqua-gel-with-vitamin-e-fragrance-free-spf-50-pa.jpg","url":"https://thedermaco.com/products/1-hyaluronic-sunscreen-aqua-gel"},
    {"id":402,"brand":"The Derma Co","name":"10% Niacinamide Face Serum with 2% Zinc","category":"Serum","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Normal"],"concerns":["Oiliness","Acne / Breakouts","Uneven Texture","Dullness"],"reason":"Real-brand niacinamide serum option; check the live listing for current price and details.","image":"https://thedermaco.com/cdn/shop/files/13_a000796e-c8b5-48cd-9a2d-97c6b5cb82dc.jpg?v=1783947202&width=1080","url":"https://thedermaco.com/collections/serums"},
    {"id":501,"brand":"Deconstruct","name":"Gel Sunscreen SPF 50+","category":"Sunscreen","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Normal"],"concerns":["Oiliness","Acne / Breakouts","Pigmentation","Dullness","General Care"],"reason":"Lightweight gel sunscreen option from Deconstruct’s current sunscreen range.","image":"https://cdn.pixelbin.io/v2/plain-cake-860195/netmed/wrkr/products/assets/item/free/original/wLk5VbZTYs-deconstruct_lightweight_gel_sunscreen_spf_55_pa_50_gm_885141_0_0.jpg","url":"https://thedeconstruct.in/products/gel-sunscreen-for-oily-skin-spf-55-and-pa-water-resistant-sunscreen-copy"},
    {"id":502,"brand":"Deconstruct","name":"Brightening Niacinamide Serum 10% + Alpha Arbutin 0.3%","category":"Serum","budget":"Medium","price":"Check live price","skinTypes":["Oily","Combination","Normal","Dry"],"concerns":["Pigmentation","Dullness","Uneven Texture","Acne / Breakouts"],"reason":"Open the current Deconstruct serum collection to choose the product matching the selected concern.","image":"https://www.bigbasket.com/media/uploads/p/l/40276990_2-deconstruct-brightening-serum-reduces-hyperpigmentation-tanning.jpg","url":"https://thedeconstruct.in/products/niacinamide-and-alpha-arbutin-brightening-serum"},
]

CACHE = {"products": None, "updatedAt": None}


def clean_price(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value).replace(',', '').strip()
    m = re.search(r'(?:₹|INR|Rs\.?\s*)?([0-9]+(?:\.[0-9]+)?)', text, re.I)
    return f"₹{m.group(1)}" if m else str(value)


def walk_jsonld(obj):
    if isinstance(obj, list):
        for item in obj:
            yield from walk_jsonld(item)
    elif isinstance(obj, dict):
        yield obj
        if '@graph' in obj:
            yield from walk_jsonld(obj['@graph'])


def parse_official_page(item):
    result = dict(item)
    try:
        r = requests.get(item['url'], headers=HEADERS, timeout=12, allow_redirects=True)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        product_data = None
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                data = json.loads(script.string or script.get_text())
                for obj in walk_jsonld(data):
                    types = obj.get('@type', [])
                    if isinstance(types, str): types = [types]
                    if 'Product' in types:
                        product_data = obj
                        break
                if product_data: break
            except Exception:
                continue

        if product_data:
            result['name'] = product_data.get('name') or item['name']
            images = product_data.get('image')
            if isinstance(images, list) and images: result['image'] = images[0]
            elif isinstance(images, str): result['image'] = images
            offers = product_data.get('offers')
            if isinstance(offers, list) and offers: offers = offers[0]
            if isinstance(offers, dict):
                price = offers.get('price') or offers.get('lowPrice')
                if price: result['price'] = clean_price(price)
                result['availability'] = offers.get('availability', '').split('/')[-1] or 'Unknown'
                result['currency'] = offers.get('priceCurrency', 'INR')
            result['url'] = product_data.get('url') or r.url
        else:
            meta_img = soup.find('meta', property='og:image')
            meta_price = soup.find('meta', attrs={'property': 'product:price:amount'})
            meta_title = soup.find('meta', property='og:title')
            if meta_img and meta_img.get('content'): result['image'] = meta_img['content']
            if meta_price and meta_price.get('content'): result['price'] = clean_price(meta_price['content'])
            if meta_title and meta_title.get('content'): result['name'] = meta_title['content'].strip()
            result['url'] = r.url

        result['live'] = True
        result['source'] = 'Official product page'
        result['lastChecked'] = datetime.now(timezone.utc).isoformat()
        return result
    except Exception as exc:
        result['live'] = False
        result['source'] = 'Cached catalog (official page unavailable)'
        result['error'] = str(exc)[:180]
        return result


def get_live_products():
    refreshed = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(parse_official_page, item) for item in CATALOG]
        for f in as_completed(futures):
            refreshed.append(f.result())
    refreshed.sort(key=lambda x: x['id'])
    live_count = sum(1 for p in refreshed if p.get('live'))
    updated = datetime.now(timezone.utc).isoformat()
    CACHE['products'] = refreshed
    CACHE['updatedAt'] = updated
    return refreshed, live_count, updated


@app.get('/api/health')
def health():
    return jsonify({'ok': True, 'service': 'DermaSense Live Product API'})


@app.get('/api/products')
def products_api():
    products, live_count, updated = get_live_products()
    return jsonify({
        'live': live_count > 0,
        'liveCount': live_count,
        'total': len(products),
        'updatedAt': updated,
        'products': products,
        'note': 'Live fields are refreshed from configured official product pages. If a source blocks a request, its cached catalog image/details are returned and marked live=false.'
    })


@app.get('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.get('/<path:path>')
def static_files(path):
    return send_from_directory(BASE_DIR, path)



if __name__ == '__main__':
    print('DermaSense AI 2.0 running at http://127.0.0.1:5000')
    print('Open the URL above in your browser; keep this terminal open.')
    app.run(host='127.0.0.1', port=5000, debug=False)
