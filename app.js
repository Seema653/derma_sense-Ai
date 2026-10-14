/* DermaSense AI 2.0 - Member 1 Frontend
   Requested update:
   - Profile now asks only Age + Lifestyle habits
   - Profile comes before camera
   - Camera capture replaces file-first skin analysis
   - Concern reference images appear only after concern selection
   - Product cards use real Indian skincare brands + official product links/images
*/

const products = [
  {
    id: 101, brand: 'Cetaphil', name: 'Gentle Skin Cleanser 125 ml', category: 'Cleanser', budget: 'Low', price: '₹426*',
    skinTypes: ['Dry','Normal','Sensitive'], concerns: ['Dryness','Sensitivity','Redness','General Care'],
    reason: 'Gentle cleanser for dry-to-normal and sensitive skin.',
    image: 'https://www.clickoncare.com/cdn/shop/files/Cetaphil-Gentle-Skin-Cleanser125ml01.jpg?v=1685184569&width=416',
    url: 'https://www.cetaphil.in/products/cleansers/gentle-skin-cleanser/8906005274105.html'
  },
  {
    id: 102, brand: 'Cetaphil', name: 'Oily Skin Cleanser 250 ml', category: 'Cleanser', budget: 'Medium', price: '₹707*',
    skinTypes: ['Oily','Combination','Sensitive'], concerns: ['Oiliness','Acne / Breakouts','General Care'],
    reason: 'Low-lather gel cleanser designed for combination-to-oily sensitive skin.',
    image: 'https://www.toyssam.com/cdn/shop/files/8906005275189_1.png?v=1747483193&width=832',
    url: 'https://www.cetaphil.in/products/cleansers/oily-skin-cleanser/8906005275189.html'
  },
  {
    id: 103, brand: 'Cetaphil', name: 'Gentle Foaming Cleanser 236 ml', category: 'Cleanser', budget: 'Medium', price: '₹899*',
    skinTypes: ['Dry','Normal','Sensitive'], concerns: ['Dryness','Sensitivity','Redness','General Care'],
    reason: 'Foaming daily cleanser formulated for dry-to-normal sensitive skin.',
    image: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/902811/XJ2JV5KskM-902811_1.jpg',
    url: 'https://www.cetaphil.in/products/cleansers/gentle-foaming-cleanser/3499320010092.html'
  },
  {
    id: 104, brand: 'Cetaphil', name: 'Gentle Exfoliating SA Cleanser 236 ml', category: 'Cleanser', budget: 'Medium', price: '₹1100*',
    skinTypes: ['Oily','Combination','Sensitive'], concerns: ['Acne / Breakouts','Oiliness','Uneven Texture','Pigmentation'],
    reason: 'Exfoliating cleanser listed by Cetaphil for oily, acne-prone and sensitive skin.',
    image: 'https://www.justmylook.com/cdn/shop/files/CET0067.png?v=1749830587',
    url: 'https://www.cetaphil.in/products-3/cetaphil-gentle-exfoliating-sa-cleanser/3499320017275.html'
  },
  {
    id: 105, brand: 'Cetaphil', name: 'Daily Exfoliating Cleanser 178 ml', category: 'Cleanser', budget: 'Medium', price: '₹799*',
    skinTypes: ['Sensitive','Normal','Combination'], concerns: ['Dullness','Uneven Texture','General Care'],
    reason: 'Daily cleanser with gentle exfoliation for smoother-looking skin.',
    image: 'https://images.apollo247.in/pub/media/catalog/product/C/E/CET0408_1-JULY23_1.jpg',
    url: 'https://www.cetaphil.in/products/cleansers/cetaphil-daily-exfoliating-cleanser/IN_9318637044030.html/'
  },
  {
    id: 201, brand: 'Dot & Key', name: 'Vitamin C + E Super Bright Sunscreen SPF 50+', category: 'Sunscreen', budget: 'Medium', price: '₹595*',
    skinTypes: ['Normal','Dry','Combination','Oily','Sensitive'], concerns: ['Pigmentation','Dullness','General Care'],
    reason: 'Daily sunscreen from the current Dot & Key range.',
    image: 'https://d1puc9h291tp0h.cloudfront.net/uploads/all/I2opLRY0gFV4g9FAbUnzViE0PW7HGDi7LqIwbc8e.jpg',
    url: 'https://www.dotandkey.com/products/dot-key-vitamin-c-e-spf-50-pa-face-sunscreen-for-glowing-skin-uv-protection-for-dull-skin'
  },
  {
    id: 202, brand: 'Dot & Key', name: 'Barrier Repair Moisturizer – Ceramides + Hyaluronic Acid', category: 'Moisturizer', budget: 'Medium', price: '₹509*',
    skinTypes: ['Dry','Sensitive','Combination'], concerns: ['Dryness','Redness','Sensitivity','Uneven Texture'],
    reason: 'Current official listing: suitable for dry, sensitive and combination skin.',
    image: 'https://www.dotandkey.com/cdn/shop/files/1-_175g.jpg?v=1783515808&width=768',
    url: 'https://www.dotandkey.com/products/dot-key-ceramides-hyaluronic-hydrating-face-cream-i-repairs-skin-barrier-intense-moisturization-sensitive-dry-skin-fragrance-free'
  },
  {
    id: 203, brand: 'Dot & Key', name: 'Watermelon Cooling Sunscreen SPF 50+', category: 'Sunscreen', budget: 'Medium', price: '₹506*',
    skinTypes: ['Oily','Combination','Normal'], concerns: ['Oiliness','Pigmentation','Dullness','General Care'],
    reason: 'Lightweight sunscreen option from the current Dot & Key sunscreen range.',
    image: 'https://www.dotandkey.com/cdn/shop/files/watersunscreen80gm_14edc323-f7f2-432c-8d0c-26444a415e50.jpg?v=1727354626',
    url: 'https://www.dotandkey.com/collections/sunscreen'
  },
  {
    id: 301, brand: 'Plum', name: 'Green Tea Pore Cleansing Face Wash', category: 'Cleanser', budget: 'Low', price: '₹288*',
    skinTypes: ['Oily','Combination'], concerns: ['Oiliness','Acne / Breakouts','Uneven Texture'],
    reason: 'Current Plum listing: formulated for oily, combination and acne-prone skin.',
    image: 'https://m.media-amazon.com/images/I/41AFseafb5L._SL1001_.jpg',
    url: 'https://plumgoodness.com/products/green-tea-pore-cleansing-face-wash'
  },
  {
    id: 302, brand: 'Plum', name: '2% Niacinamide & Rice Water Gel Moisturizer', category: 'Moisturizer', budget: 'Low', price: '₹349*',
    skinTypes: ['Oily','Combination','Normal'], concerns: ['Oiliness','Acne / Breakouts','Dullness','Uneven Texture','General Care'],
    reason: 'Current Plum listing: lightweight gel moisturizer, especially useful for oily or combination skin.',
    image: 'https://images-static.nykaa.com/media/catalog/product/2/2/221592aPLUMX00000641_01.jpg',
    url: 'https://plumgoodness.com/products/2-niacinamide-rice-water-brightening-gel-moisturizer-25-g'
  },
  {
    id: 303, brand: 'Plum', name: '2% Niacinamide & Rice Water SPF 50 Sunscreen', category: 'Sunscreen', budget: 'Medium', price: '₹539*',
    skinTypes: ['Oily','Combination','Normal','Dry'], concerns: ['Acne / Breakouts','Pigmentation','Dullness','Oiliness','General Care'],
    reason: 'Current Plum sunscreen listing with niacinamide and rice water.',
    image: 'https://plumgoodness.com/cdn/shop/files/Nia-SPF-80g_Amazon_1001x1001_02_42ffb381-f67e-4c20-845d-f33878b8a081.jpg?v=1756375215&width=900',
    url: 'https://plumgoodness.com/products/plum-2-niacinamide-rice-water-spf-50-pa-sunscreen-reduces-blemishes-brightens-skin-protects-from-uva-uvb-rays-fragrance-free-all-skin-types'
  },
  {
    id: 401, brand: 'The Derma Co', name: '1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++', category: 'Sunscreen', budget: 'Medium', price: '₹439*',
    skinTypes: ['Oily','Dry','Normal','Combination'], concerns: ['Dryness','Acne / Breakouts','Pigmentation','Dullness','General Care'],
    reason: 'Current official listing: lightweight SPF 50 PA++++ gel for all skin types.',
    image: 'https://www.bbassets.com/media/uploads/p/l/1200010309_2-the-derma-co-1-hyaluronic-sunscreen-aqua-gel-with-vitamin-e-fragrance-free-spf-50-pa.jpg',
    url: 'https://thedermaco.com/products/1-hyaluronic-sunscreen-aqua-gel'
  },
  {
    id: 402, brand: 'The Derma Co', name: '10% Niacinamide Face Serum with 2% Zinc', category: 'Serum', budget: 'Medium', price: '₹515*',
    skinTypes: ['Oily','Combination','Normal'], concerns: ['Oiliness','Acne / Breakouts','Uneven Texture','Dullness'],
    reason: 'Real-brand niacinamide serum option; check the live listing for current price and details.',
    image: 'https://cdn.shopify.com/s/files/1/0888/8057/8807/files/fop_10_nia_new.jpg?v=1758286593&width=1024',
    imageFallback: 'https://cdn.shopify.com/s/files/1/0888/8057/8807/files/fop_10_nia_new.jpg?v=1758286593&width=1024',
    url: 'https://thedermaco.com/collections/serums'
  },
  {
    id: 501, brand: 'Deconstruct', name: 'Lightweight Gel Sunscreen SPF 50 PA++++', category: 'Sunscreen', budget: 'Medium', price: '₹499*',
    skinTypes: ['Oily','Combination','Normal'], concerns: ['Oiliness','Acne / Breakouts','Pigmentation','Dullness','General Care'],
    reason: 'Lightweight gel sunscreen option from Deconstruct’s current sunscreen range.',
    image: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/deconstruct/1085980/0/unZVEAMuwW-Yo19osNNvH-SKU007_1.jpg',
    imageFallback: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/deconstruct/1085980/0/unZVEAMuwW-Yo19osNNvH-SKU007_1.jpg',
    url: 'https://thedeconstruct.in/products/gel-sunscreen-for-oily-skin-spf-55-and-pa-water-resistant-sunscreen-copy'
  },
  {
    id: 502, brand: 'Deconstruct', name: 'Brightening Niacinamide Serum 10% + Alpha Arbutin 0.3%', category: 'Serum', budget: 'Medium', price: '₹524*',
    skinTypes: ['Oily','Combination','Normal','Dry'], concerns: ['Pigmentation','Dullness','Uneven Texture','Acne / Breakouts'],
    reason: 'Open the current Deconstruct serum collection to choose the product matching the selected concern.',
    image: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/deconstruct/1085980/0/unZVEAMuwW-Yo19osNNvH-SKU007_1.jpg',
    imageFallback: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/deconstruct/1085980/0/unZVEAMuwW-Yo19osNNvH-SKU007_1.jpg',
    url: 'https://thedeconstruct.in/collections/serums'
  }
];

const concernReferences = {
  'Acne / Breakouts': {
    title: 'Acne / Breakouts — real facial reference',
    text: 'Real clinical photograph from DermNet. Reference only; the app does not diagnose from this image.',
    image: 'assets/concerns/acne-breakouts.jpg'
  },
  'Redness': {
    title: 'Redness — real facial reference',
    text: 'Real clinical photograph from DermNet. Reference only; redness can have many causes.',
    image: 'assets/concerns/redness.jpg'
  },
  'Dryness': {
    title: 'Dryness — real facial reference',
    text: 'Real facial clinical photograph from DermNet. Reference only; this is not a diagnosis.',
    image: 'assets/concerns/dryness.jpg'
  },
  'Oiliness': {
    title: 'Oiliness — real face reference',
    text: 'Real photographic face reference. Oily skin is commonly described as shiny; this image is only a visual aid.',
    image: 'assets/concerns/oiliness.jpg'
  },
  'Pigmentation': {
    title: 'Pigmentation — real facial reference',
    text: 'Real facial clinical photograph from DermNet showing pigmentation. Reference only; not a diagnosis.',
    image: 'assets/concerns/pigmentation.jpg'
  },
  'Sensitivity': {
    title: 'Sensitivity — real facial reference',
    text: 'Real facial clinical photograph from DermNet showing contact dermatitis. It is only a visual reference for irritation/reactivity.',
    image: 'assets/concerns/sensitivity.jpg'
  },
  'Dullness': {
    title: 'Dullness — real face reference',
    text: 'Dullness is subjective and is not a diagnosis. This real face photo is only a visual reference.',
    image: 'assets/concerns/dullness.jpg'
  },
  'Uneven Texture': {
    title: 'Uneven Texture — real facial reference',
    text: 'Real facial clinical photograph from DermNet showing a bumpy/rough texture pattern. Reference only.',
    image: 'assets/concerns/uneven-texture.jpg'
  },
  'General Care': {
    title: 'General Care — real face reference',
    text: 'Real face photograph for everyday skincare context. This image is not a clinical assessment.',
    image: 'assets/concerns/general-care.jpg'
  }
};

let analysisComplete = false;
let selectedConcerns = [];
let recommendedProducts = [];
let cameraStream = null;
let capturedPhotoData = '';
let liveProducts = [];
let productCatalogState = { live: false, liveCount: 0, total: 0, updatedAt: null };
let productsLoaded = false;

function showSection(id) {
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  if (id === 'analysis') {
    const profile = getProfile();
    if (profile) {
      document.getElementById('cameraGate').hidden = true;
      document.getElementById('cameraArea').hidden = false;
      startCamera();
    } else {
      document.getElementById('cameraGate').hidden = false;
      document.getElementById('cameraArea').hidden = true;
    }
  }
  if (id === 'dashboard') renderDashboard();
  if (id === 'products') renderProducts();
}

function getLifestyleSelections() {
  return [...document.querySelectorAll('input[name="lifestyle"]:checked')].map(input => input.value);
}

function saveProfileAndContinue() {
  const age = document.getElementById('age').value.trim();
  const lifestyle = getLifestyleSelections();
  const budgetChoice = document.querySelector('input[name="profileBudget"]:checked')?.value || '';
  const skinType = document.getElementById('skinType')?.value || '';

  if (!age) {
    document.getElementById('profileStatus').textContent = 'Please enter your age.';
    return;
  }
  if (!skinType) {
    document.getElementById('profileStatus').textContent = 'Please select your skin type.';
    return;
  }
  if (!lifestyle.length) {
    document.getElementById('profileStatus').textContent = 'Please select at least one lifestyle habit.';
    return;
  }
  if (!budgetChoice) {
    document.getElementById('profileStatus').textContent = 'Please choose your skincare budget.';
    return;
  }

  const profile = { age, skinType, lifestyle, budget: budgetChoice };
  localStorage.setItem('dermasenseProfile', JSON.stringify(profile));
  document.getElementById('profileStatus').textContent = 'Profile saved. Opening camera…';
  showSection('analysis');
}

function getProfile() {
  return JSON.parse(localStorage.getItem('dermasenseProfile') || 'null');
}

async function startCamera() {
  const video = document.getElementById('camera');
  const status = document.getElementById('cameraStatus');
  if (!video) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    status.textContent = 'Camera access is not supported in this browser. Use the existing-photo option below.';
    return;
  }

  try {
    if (cameraStream) stopCamera();
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = cameraStream;
    status.textContent = 'Camera ready. Position your face inside the guide and take a photo.';
  } catch (error) {
    status.textContent = 'Camera permission was not available. Please allow camera access or use an existing photo.';
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  const video = document.getElementById('camera');
  if (video) video.srcObject = null;
}

function capturePhoto() {
  const video = document.getElementById('camera');
  const canvas = document.getElementById('captureCanvas');
  const preview = document.getElementById('preview');
  const status = document.getElementById('cameraStatus');

  if (!video || !video.videoWidth) {
    status.textContent = 'Camera is not ready yet. Please allow camera access and try again.';
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedPhotoData = canvas.toDataURL('image/jpeg', 0.88);
  preview.src = capturedPhotoData;
  preview.hidden = false;
  status.textContent = 'Photo captured successfully. Select your concerns, then analyze.';
  stopCamera();
}

function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('preview');
  if (!file) {
    preview.hidden = true;
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    capturedPhotoData = e.target.result;
    preview.src = capturedPhotoData;
    preview.hidden = false;
    document.getElementById('cameraStatus').textContent = 'Existing photo loaded. Select your concerns, then analyze.';
  };
  reader.readAsDataURL(file);
}

function getSelectedConcerns() {
  return [...document.querySelectorAll('input[name="concern"]:checked')].map(input => input.value);
}

function renderConcernReferences() {
  const selected = getSelectedConcerns();
  const container = document.getElementById('concernReferences');

  if (!selected.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = selected.map(concern => {
    const ref = concernReferences[concern];
    return `
      <article class="concern-reference">
        <img src="${ref.image}" alt="${ref.title}" loading="lazy">
        <div>
          <span class="badge">Selected concern</span>
          <h3>${ref.title}</h3>
          <p class="reference-label">What this concern may look like</p>
          <p>${ref.text}</p>
        </div>
      </article>
    `;
  }).join('');
}

function buildAnalysis(selected, profile) {
  const lifestyle = profile?.lifestyle || [];
  const lifestyleText = lifestyle.length ? lifestyle.join(', ') : 'Not specified';

  const careMap = {
    'Acne / Breakouts': 'gentle cleansing, non-heavy hydration, and consistent daytime sun protection',
    'Redness': 'gentle products, hydration, and avoiding an unnecessarily complicated routine',
    'Dryness': 'hydration-focused cleansing and moisturizer support',
    'Oiliness': 'gentle cleansing, lightweight hydration, and non-heavy product choices',
    'Pigmentation': 'daily sun protection and a simple targeted-care routine',
    'Sensitivity': 'fragrance-conscious, gentle care and a simple routine',
    'Dullness': 'hydration, daily sun protection, and targeted-care options',
    'Uneven Texture': 'gentle cleansing, hydration, and gradual targeted care',
    'General Care': 'a simple cleanser, moisturizer, and daily sunscreen routine'
  };

  const matchedCare = selected.map(c => careMap[c]).filter(Boolean);
  const lifestyleTips = [];

  if (lifestyle.includes('Junk Food') || lifestyle.includes('Fast Food')) {
    lifestyleTips.push('Keep meals balanced and include a variety of fruits, vegetables, grains and protein sources.');
  }
  if (lifestyle.includes('Sugary Drinks')) lifestyleTips.push('Prefer water and balanced drinks more often.');
  if (lifestyle.includes('Low Water Intake')) lifestyleTips.push('Build a regular water-drinking habit throughout the day.');
  if (lifestyle.includes('Poor Sleep')) lifestyleTips.push('Aim for a consistent sleep routine.');
  if (lifestyle.includes('High Stress')) lifestyleTips.push('Use healthy stress-management habits such as breaks, movement or relaxation.');
  if (!lifestyleTips.length) lifestyleTips.push('Continue your healthy habits and keep your skincare routine simple and consistent.');

  return {
    summary: `Your analysis considered ${selected.length} selected concern${selected.length > 1 ? 's' : ''}: ${selected.join(', ')}.`,
    profile: `Age: ${profile?.age || '-'} years • Skin Type: ${profile?.skinType || '-'} • Budget: ${profile?.budget || '-'} • Lifestyle: ${lifestyleText}.`,
    lifestyle: `Lifestyle selected: ${lifestyleText}.`,
    care: [...new Set(matchedCare)],
    lifestyleTips,
    note: 'The camera photo is captured for the demo workflow. This frontend does not make a clinical diagnosis. If a skin problem is severe, painful, persistent, or worsening, consider consulting a qualified healthcare professional.'
  };
}

function getRecommendedProducts(concerns, catalog = null) {
  const profile = getProfile() || {};
  const skinType = profile.skinType || '';
  const sourceCatalog = Array.isArray(catalog) && catalog.length ? catalog : products;

  // Keep every useful real product, but rank it by selected concern + skin type.
  const matches = sourceCatalog.map(product => {
    const matchedConcerns = (product.concerns || []).filter(c => concerns.includes(c));
    const skinMatch = Boolean(skinType && product.skinTypes?.includes(skinType));
    const score = matchedConcerns.length * 10 + (skinMatch ? 8 : 0) + (product.category === 'Sunscreen' ? 1 : 0);
    return { ...product, matchCount: matchedConcerns.length, matchedConcerns, skinMatch, score };
  }).filter(product => product.matchCount > 0 || product.skinMatch);

  matches.sort((a, b) => b.score - a.score || b.matchCount - a.matchCount || a.id - b.id);
  return matches;
}

function getRoutineAdvice(concerns) {
  return [
    { step: '1. Cleanser', text: 'Use a gentle cleanser suited to your routine, especially in the morning and evening.' },
    { step: '2. Targeted Care', text: concerns.some(c => ['Acne / Breakouts','Pigmentation','Dullness','Uneven Texture','Oiliness'].includes(c)) ? 'Choose one targeted product that matches your selected concern and introduce it gradually.' : 'A targeted serum is optional for basic care.' },
    { step: '3. Moisturizer', text: 'Choose a comfortable moisturizer based on how your skin feels.' },
    { step: '4. Sunscreen — Morning', text: 'Use sunscreen every morning as the final skincare step.' }
  ];
}

async function analyze() {
  selectedConcerns = getSelectedConcerns();
  const error = document.getElementById('concernError');

  if (!capturedPhotoData) {
    error.textContent = 'Please take a camera photo or choose an existing photo first.';
    return;
  }
  if (!selectedConcerns.length) {
    error.textContent = 'Please select at least one concern before analysis.';
    return;
  }

  error.textContent = 'Analyzing your image… please wait.';
  const profile = getProfile() || {};

  try {
    const imageBlob = await (await fetch(capturedPhotoData)).blob();
    const formData = new FormData();
    formData.append('image', imageBlob, 'skin-photo.jpg');
    formData.append('concern', selectedConcerns[0]);
    formData.append('profile', JSON.stringify(profile));

    const response = await fetch('/api/analyze-skin', {
      method: 'POST',
      body: formData
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      const quality = payload.image_quality;
      const qualityText = quality?.messages?.length
        ? ' Image check: ' + quality.messages.join(' ')
        : '';
      throw new Error((payload.message || `Analysis failed (HTTP ${response.status}).`) + qualityText);
    }

    const backendResult = payload.data || {};
    const analysis = buildAnalysis(selectedConcerns, profile);
    analysis.visualObservations = backendResult.observations || [];
    analysis.visualConcerns = backendResult.visual_concerns || [];
    analysis.aiRecommendations = backendResult.recommendations || [];
    analysis.note = backendResult.disclaimer || analysis.note;
    recommendedProducts = getRecommendedProducts(selectedConcerns, liveProducts.length ? liveProducts : products);
    analysisComplete = true;

    localStorage.setItem('dermasenseLastAnalysis', JSON.stringify({
      date: new Date().toLocaleString(),
      concerns: selectedConcerns,
      analysis,
      productIds: recommendedProducts.map(p => p.id)
    }));

    const routine = getRoutineAdvice(selectedConcerns);
    const visualList = analysis.visualObservations.length
      ? analysis.visualObservations.map(item => `<li>${item}</li>`).join('')
      : '<li>No strong visible pattern detected.</li>';
    const aiList = analysis.aiRecommendations.length
      ? analysis.aiRecommendations.map(item => `<li><b>${item.title}</b> — ${item.reason} <span class="small-note">(${item.priority} priority)</span></li>`).join('')
      : '<li>Keep a simple, consistent routine.</li>';

    document.getElementById('result').innerHTML = `
      <h3>Camera + Requirements Analysis Result</h3>
      <p><b>${analysis.summary}</b></p>
      <p>${analysis.profile}</p>
      <p>${analysis.lifestyle}</p>
      <h4>Visible image observations (AI module)</h4>
      <ul>${visualList}</ul>
      <h4>Decision engine recommendations</h4>
      <ul>${aiList}</ul>
      <h4>What your routine should focus on</h4>
      <ul>${analysis.care.map(item => `<li>${item}</li>`).join('')}</ul>
      <h4>Lifestyle suggestions</h4>
      <ul>${analysis.lifestyleTips.map(item => `<li>${item}</li>`).join('')}</ul>
      <h4>Recommended order</h4>
      <div class="routine-list">${routine.map(item => `<div class="routine-item"><b>${item.step}</b><span>${item.text}</span></div>`).join('')}</div>
      <p class="small-note">${analysis.note}</p>
      <button class="primary" onclick="showRecommendedProducts()">Show My Recommended Products</button>
    `;

    error.textContent = 'Analysis completed successfully.';
    saveHistory(selectedConcerns, analysis);
    renderProducts();
  } catch (err) {
    error.textContent = `Could not complete analysis: ${err.message} Please try a clear, well-lit photo.`;
  }
}

function showRecommendedProducts() {
  showSection('products');
  renderProducts();
  document.getElementById('productList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function budgetRank(budget) {
  return { Low: 1, Medium: 2, Flexible: 3 }[budget] || 3;
}

function productFitsProfileBudget(product) {
  const profile = getProfile();
  if (!profile?.budget) return true;
  return budgetRank(product.budget) <= budgetRank(profile.budget);
}

async function loadLiveProducts() {
  try {
    const response = await fetch('/api/products', { cache: 'no-store' });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.products) || !data.products.length) throw new Error('No products returned');
    liveProducts = data.products;
    productCatalogState = {
      live: Boolean(data.live),
      liveCount: Number(data.liveCount || 0),
      total: Number(data.total || data.products.length),
      updatedAt: data.updatedAt || null
    };
    productsLoaded = true;
    if (selectedConcerns.length) recommendedProducts = getRecommendedProducts(selectedConcerns, liveProducts);
  } catch (error) {
    liveProducts = [];
    productCatalogState = { live: false, liveCount: 0, total: products.length, updatedAt: null };
    console.warn('DermaSense live product API unavailable; using bundled catalog.', error);
  }
  renderProducts();
}

function renderProducts() {
  const message = document.getElementById('productMessage');
  const controls = document.getElementById('productControls');
  const list = document.getElementById('productList');
  if (!message || !controls || !list) return;

  if (!analysisComplete) {
    message.hidden = false;
    controls.hidden = true;
    list.innerHTML = '';
    return;
  }

  message.hidden = false;
  const profile = getProfile() || {};
  const skinText = profile.skinType ? ` + ${profile.skinType} skin` : '';
  const catalog = liveProducts.length ? liveProducts : products;
  const source = recommendedProducts.length ? recommendedProducts : catalog;
  const liveLabel = productCatalogState.live ? 'LIVE' : 'CACHED';
  const updated = productCatalogState.updatedAt ? new Date(productCatalogState.updatedAt).toLocaleString() : 'not refreshed';
  message.innerHTML = `<b>${liveLabel} product catalog.</b> Showing real-brand products matched to ${selectedConcerns.join(', ')}${skinText}. ${productCatalogState.liveCount || 0}/${productCatalogState.total || source.length} listings refreshed from official product pages. Last refresh: ${updated}. If a store blocks a live request, that item is marked cached.`;
  controls.hidden = false;

  const brand = document.getElementById('brand').value;
  const category = document.getElementById('category').value;
  const budget = document.getElementById('productBudget').value;
  const visible = source.filter(product =>
    (brand === 'All Brands' || product.brand === brand) &&
    (category === 'All' || product.category === category) &&
    (budget === 'All' || product.budget === budget)
  );

  if (!visible.length) {
    list.innerHTML = '<div class="card"><p>No product matched the selected filters. Try another brand, category or budget.</p></div>';
    return;
  }

  list.innerHTML = visible.map(createProductCard).join('');
}

function createProductCard(product) {
  const matchedText = product.matchedConcerns?.length
    ? `Concern match: ${product.matchedConcerns.join(', ')}`
    : 'Skin-type match';
  const skinText = product.skinTypes?.length ? `Skin types: ${product.skinTypes.join(', ')}` : '';
  const image = product.image
    ? `<img src="${product.image}" alt="${product.brand} ${product.name}" class="product-image" loading="lazy" referrerpolicy="no-referrer" onerror="if(this.dataset.fallbackTried!=='1' && '${product.imageFallback || ''}'){this.dataset.fallbackTried='1';this.src='${product.imageFallback || ''}';}else{this.onerror=null;this.replaceWith(Object.assign(document.createElement('div'),{className:'product-image product-image-fallback',innerHTML:'<span>${product.brand}</span><strong>${product.name}</strong><small>Product image unavailable here — open official listing</small>'}))}">`
    : `<div class="product-image product-image-fallback"><span>${product.brand}</span><strong>${product.name}</strong><small>Open official listing for the current image</small></div>`;
  return `
    <article class="product">
      <div class="live-tag">${product.live ? 'LIVE LISTING' : 'CACHED LISTING'}</div>
      ${image}
      <div class="product-body">
        <span class="badge">${product.brand}</span>
        <h3>${product.name}</h3>
        <p class="category-label">${product.category} • ${product.budget} budget</p>
        <p class="price">${product.price}</p>
        <p>${product.reason}</p>
        <p class="match-text">${matchedText}</p>
        <p class="skin-match">${skinText}</p>
        <div class="product-actions">
          <button class="primary" onclick="showProductDetails(${product.id})">View Product</button>
          <a class="product-link" href="${product.url}" target="_blank" rel="noopener">Official listing ↗</a>
        </div>
      </div>
    </article>
  `;
}

function showProductDetails(id) {
  const product = (liveProducts.length ? liveProducts : products).find(item => item.id === id);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const modalBody = document.getElementById('modalBody');
  const matched = product.matchedConcerns || product.concerns.filter(c => selectedConcerns.includes(c));

  modalBody.innerHTML = `
    <div class="modal-images">
      ${product.image ? `<img src="${product.image}" alt="${product.name} product image">` : `<div class="modal-product-fallback"><b>${product.brand}</b><span>${product.name}</span><a href="${product.url}" target="_blank" rel="noopener">Open current official listing ↗</a></div>`}
    </div>
    <span class="badge">${product.brand}</span>
    <h2>${product.name}</h2>
    <p><b>Category:</b> ${product.category}</p>
    <p class="price">${product.price}</p>
    <p>${product.reason}</p>
    <h3>Why this product is recommended</h3>
    <ul>${(matched.length ? matched : ['General Care']).map(c => `<li>Matches your concern: ${c}</li>`).join('')}</ul>
    <p class="small-note">This is a product-matching demo, not a medical diagnosis. Prices and stock can change on the brand website.</p>
    <a class="primary link-button" href="${product.url}" target="_blank" rel="noopener noreferrer">Open Official Product Page ↗</a>
  `;
  modal.hidden = false;
}

function closeProductModal(event) {
  if (event && event.target !== document.getElementById('productModal')) return;
  document.getElementById('productModal').hidden = true;
}

function saveHistory(concerns, analysis) {
  const history = JSON.parse(localStorage.getItem('dermasenseHistory') || '[]');
  history.unshift({
    date: new Date().toLocaleString(),
    concerns,
    observations: analysis.summary
  });
  localStorage.setItem('dermasenseHistory', JSON.stringify(history.slice(0, 20)));
}

function renderDashboard() {
  const profile = getProfile();
  document.getElementById('dashboardData').innerHTML = profile
    ? `<div class="card"><b>Profile</b><p>Age: ${profile.age || '-'}</p><p>Skin Type: ${profile.skinType || '-'}</p><p>Budget: ${profile.budget || '-'}</p><p>Lifestyle: ${(profile.lifestyle || []).join(', ') || '-'}</p></div>`
    : '<p>No profile saved yet.</p>';

  const history = JSON.parse(localStorage.getItem('dermasenseHistory') || '[]');
  document.getElementById('history').innerHTML = history.length
    ? history.map(item => `<div class="card"><b>${item.concerns.join(', ')}</b><p>${item.date}</p><p>${item.observations}</p></div>`).join('')
    : '<p>No analysis history yet.</p>';
}

function loadSavedProfile() {
  const profile = getProfile();
  if (!profile) return;
  document.getElementById('age').value = profile.age || '';
  const skinType = document.getElementById('skinType');
  if (skinType) skinType.value = profile.skinType || '';
  document.querySelectorAll('input[name="profileBudget"]').forEach(box => { box.checked = box.value === (profile.budget || ''); });
  document.querySelectorAll('input[name="lifestyle"]').forEach(box => {
    box.checked = (profile.lifestyle || []).includes(box.value);
  });
}

function loadLastAnalysis() {
  const last = JSON.parse(localStorage.getItem('dermasenseLastAnalysis') || 'null');
  if (!last) return;
  document.querySelectorAll('input[name="concern"]').forEach(box => {
    box.checked = last.concerns.includes(box.value);
  });
  selectedConcerns = last.concerns;
  recommendedProducts = getRecommendedProducts(selectedConcerns, liveProducts.length ? liveProducts : products);
  analysisComplete = true;
  renderConcernReferences();
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedProfile();
  loadLastAnalysis();
  renderProducts();
  loadLiveProducts();
});

window.loadLiveProducts = loadLiveProducts;
window.showSection = showSection;
window.saveProfileAndContinue = saveProfileAndContinue;
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.capturePhoto = capturePhoto;
window.previewImage = previewImage;
window.analyze = analyze;
window.renderProducts = renderProducts;
window.renderConcernReferences = renderConcernReferences;
window.showRecommendedProducts = showRecommendedProducts;
window.showProductDetails = showProductDetails;
window.closeProductModal = closeProductModal;
