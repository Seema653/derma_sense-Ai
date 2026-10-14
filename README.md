# DermaSense AI 2.0 — Integrated Project

This folder combines the frontend, live/cached product catalog API, Flask backend, SQLite storage, skin image analysis module, and decision engine.

## Requirements
- Python 3.10 or newer
- Internet connection is only needed when the product endpoint attempts to refresh official product pages. If a shop blocks requests, cached product details are returned.

## Windows setup (Command Prompt)
1. Extract this ZIP.
2. Open the extracted `DermaSense_Integrated` folder.
3. Click the folder address bar, type `cmd`, and press Enter.
4. Create a virtual environment:
   ```
   python -m venv .venv
   ```
5. Activate it:
   ```
   .venv\Scripts\activate
   ```
6. Install dependencies:
   ```
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```
7. Start the application:
   ```
   python backend\app.py
   ```
8. Keep the terminal open and visit:
   http://127.0.0.1:5000

## Basic checks
- Health endpoint: http://127.0.0.1:5000/api/health
- Products endpoint: http://127.0.0.1:5000/api/products
- The browser workflow is Profile → Camera/Existing Photo → choose concern → Analyze → Recommended Products.
- Image analysis uses visible-image heuristics and may reject dark, overexposed, low-contrast, or blurry photos. It is not a medical diagnosis.

## API routes
- `GET /api/health`
- `GET /api/products`
- `POST /api/profile` (JSON)
- `POST /api/analyze-skin` (multipart form: `image`, `concern`, `profile`)
- `GET /api/history` (optional `profile_id`)

SQLite database and uploaded images are created under `backend/` on first run.

## Notes
- The backend saves profiles, analysis observations, and decision-engine recommendations to SQLite.
- Product pages can block automated refresh. The catalog then returns cached details and marks them as not live.
- Do not commit `.venv`, API keys, or private data into source control.


## Premium UI update
The current build uses a warm ivory, sage and botanical-green design palette, responsive navigation, an editorial home hero, redesigned form cards, camera frame, product cards and mobile layouts. Google Fonts are loaded when internet access is available; system fallbacks are included.

## Important AI/API note
This UI refresh does not add a third-party AI chat API or require an API key. The current skin-analysis flow remains the existing project workflow. When adding an AI provider, keep the secret key in the Flask backend environment (never in `js/app.js` or HTML), and test the AI endpoint separately.
