/**
 * TryOn Widget — embed.js
 * Drop-in virtual try-on for any clothing store.
 *
 * Usage:
 *   <script src="https://yoursaas.com/embed.js" data-brand-id="XXX" async></script>
 *
 * Optional manual placement:
 *   <div data-tryon-product="SKU" data-tryon-image="URL"></div>
 */
(function () {
  'use strict';

  // ---------- 1. CONFIG ----------
  const scriptTag = document.currentScript ||
    document.querySelector('script[data-brand-id]');
  const brandId = scriptTag?.getAttribute('data-brand-id');

  // Deployed Next.js URL. Override per-store with data-api-base on the script tag.
  // Strip any trailing slash so `${API_BASE}/api/tryon` never produces a double slash.
  const API_BASE = (scriptTag?.getAttribute('data-api-base') || 'https://tryon-gold.vercel.app')
    .replace(/\/+$/, '');

  if (!brandId) {
    console.error('[TryOn] Missing data-brand-id on script tag');
    return;
  }

  // ---------- 2. DETECTION ----------
  function detectManual() {
    return Array.from(document.querySelectorAll('[data-tryon-product]'))
      .map(el => ({
        target: el,
        productId: el.getAttribute('data-tryon-product'),
        imageUrl: el.getAttribute('data-tryon-image'),
        mode: 'manual'
      }));
  }

  function normalizeUrl(url) {
    if (!url) return null;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return window.location.origin + url;
    return url;
  }

  function detectAuto() {
    // Shopify globals
    if (window.ShopifyAnalytics?.meta?.product) {
      const p = window.ShopifyAnalytics.meta.product;
      const target = findInjectionPoint();
      if (target && p.featured_image) {
        return [{
          target,
          productId: p.id,
          imageUrl: normalizeUrl(p.featured_image),
          mode: 'auto-shopify'
        }];
      }
    }

    // JSON-LD schema
    const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const s of ldScripts) {
      try {
        const data = JSON.parse(s.textContent);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'Product') {
            const target = findInjectionPoint();
            const img = Array.isArray(item.image) ? item.image[0] : item.image;
            const imgUrl = typeof img === 'object' ? img.url : img;
            if (target && imgUrl) {
              return [{
                target,
                productId: item.sku || item.name,
                imageUrl: normalizeUrl(imgUrl),
                mode: 'auto-jsonld'
              }];
            }
          }
        }
      } catch (e) { /* skip */ }
    }

    // Open Graph fallback
    const ogImage = document.querySelector('meta[property="og:image"]')?.content;
    if (ogImage) {
      const target = findInjectionPoint();
      if (target) {
        return [{
          target,
          productId: document.title,
          imageUrl: normalizeUrl(ogImage),
          mode: 'auto-og'
        }];
      }
    }

    return [];
  }



  // Detect a product LISTING / COLLECTION page (multiple product cards).
  // Each card gets its own compact "Try On" button.
  function detectGrid() {
    const cardSelectors = [
      '[class*="product-card"]',
      '[class*="ProductCard"]',
      '[class*="card-product"]',
      '.grid-product',
      '.product-item',
      '.product-grid-item',
      '.collection-product',
      'li.grid__item',
      '.product-collection',
    ];

    let cards = [];
    for (const sel of cardSelectors) {
      const found = document.querySelectorAll(sel);
      // A listing page has at least 2 cards — that's what tells it apart
      // from a single product page.
      if (found.length >= 2) { cards = Array.from(found); break; }
    }
    if (cards.length < 2) return [];

    // A substring selector like [class*="card-product"] also matches the
    // card's own descendants (.card-product__wrapper, __media, etc.), so a
    // grid of 8 cards can balloon into hundreds of matches. Keep only the
    // outermost element of each card — drop any match nested inside another.
    cards = cards.filter(card =>
      !cards.some(other => other !== card && other.contains(card))
    );
    if (cards.length < 2) return [];

    const products = [];
    const seen = new Set();
    for (const card of cards) {
      const img = card.querySelector('img');
      if (!img) continue;

      // Handle lazy-loaded images (data-src / srcset placeholders).
      const rawSrc =
        img.currentSrc ||
        img.getAttribute('src') ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-original') ||
        (img.getAttribute('data-srcset') || img.getAttribute('srcset') || '')
          .split(',')[0].trim().split(' ')[0];
      const imageUrl = normalizeUrl(rawSrc);
      if (!imageUrl || imageUrl.startsWith('data:')) continue;

      const link =
        card.querySelector('a[href*="/products/"]') ||
        card.querySelector('a[href]');

      let productId = null;
      let name = null;
      if (link) {
        const href = link.getAttribute('href') || '';
        const m = href.match(/\/products\/([^/?#]+)/);
        productId = m ? m[1] : (href || null);
        name = (link.textContent || '').trim() || null;
      }
      productId = productId || img.getAttribute('alt') || 'product';
      name = name || img.getAttribute('alt') || productId;

      // Avoid duplicates when card selectors overlap nested elements.
      if (seen.has(card)) continue;
      seen.add(card);

      products.push({
        target: card,
        productId,
        name,
        imageUrl,
        mode: 'auto-grid',
      });
    }
    return products;
  }

  function findInjectionPoint() {
    const selectors = [
      '.product-form-extras',
      '.product-form__buttons',
      '.product-form__cart',
      '.product-form__submit',
      'form[action*="/cart/add"] button[type="submit"]',
      'form[action*="/cart/add"]',
      'button[name="add"]',
      'button[name="add-to-cart"]',
      '[class*="add-to-cart"]',
      '[class*="AddToCart"]',
      '[data-add-to-cart]',
      '.shopify-payment-button',
      'product-form',
      '.product__info-container',
      '.product-single__meta',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        if (el.classList.contains('product-form-extras')) return el;
        return el.tagName === 'BUTTON' ? el.parentElement : el;
      }
    }
    // Last resort: inject near the price or product title
    return document.querySelector('.product__price, .price, h1')?.parentElement || null;
  }

  // ---------- 3. BUTTON INJECTION ----------
  function injectButton(product) {
    if (!product.target || product.target.querySelector('.tryon-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'tryon-btn';
    btn.type = 'button';
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
      </svg>
      <span>Try It On Virtually</span>
    `;
    btn.style.cssText = `
      width: 100%;
      padding: 16px;
      margin-bottom: 12px;
      background: transparent;
      color: #1a1a1a;
      border: 1px solid #1a1a1a;
      font-family: inherit;
      font-size: 12px;
      letter-spacing: 3px;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s;
    `;
    btn.onmouseenter = () => { btn.style.background = '#1a1a1a'; btn.style.color = '#fff'; };
    btn.onmouseleave = () => { btn.style.background = 'transparent'; btn.style.color = '#1a1a1a'; };
    btn.onclick = () => openModal(product);

    product.target.appendChild(btn);
    console.log('[TryOn] Button injected via:', product.mode);
  }

  // Compact button for product cards on listing/collection pages.
  function injectCardButton(product) {
    if (!product.target || product.target.querySelector('.tryon-card-btn')) return;

    const card = product.target;
    // Anchor the absolutely-positioned button to the card.
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }

    const btn = document.createElement('button');
    btn.className = 'tryon-card-btn';
    btn.type = 'button';
    btn.title = 'Try It On Virtually';
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
      </svg>
      <span>Try On</span>
    `;
    btn.style.cssText = `
      position: absolute;
      top: 10px; right: 10px;
      z-index: 5;
      padding: 7px 11px;
      background: rgba(255,255,255,0.95);
      color: #1a1a1a;
      border: 1px solid #1a1a1a;
      border-radius: 999px;
      font-family: inherit;
      font-size: 10px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      line-height: 1;
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
      transition: all 0.2s;
    `;
    btn.onmouseenter = () => { btn.style.background = '#1a1a1a'; btn.style.color = '#fff'; };
    btn.onmouseleave = () => { btn.style.background = 'rgba(255,255,255,0.95)'; btn.style.color = '#1a1a1a'; };
    // Cards are usually wrapped in a link — don't navigate away on click.
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(product);
    };

    card.appendChild(btn);
    console.log('[TryOn] Card button injected for:', product.productId);
  }

  // ---------- 4. MODAL ----------
  function openModal(product) {
    const overlay = document.createElement('div');
    overlay.id = 'tryon-overlay';
    overlay.innerHTML = `
      <style>
        #tryon-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 999999;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          animation: tryonFadeIn 0.2s ease;
        }
        @keyframes tryonFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tryonSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .tryon-modal {
          background: #fff;
          width: 92%; max-width: 520px;
          max-height: 90vh;
          border-radius: 2px;
          overflow: hidden;
          display: flex; flex-direction: column;
          animation: tryonSlideUp 0.25s ease;
        }
        .tryon-header {
          padding: 22px 28px;
          border-bottom: 1px solid #ebebeb;
          display: flex; justify-content: space-between; align-items: center;
        }
        .tryon-title {
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: #000; font-weight: 600;
        }
        .tryon-close {
          background: none; border: none; font-size: 22px; cursor: pointer;
          color: #999; line-height: 1; padding: 0;
          transition: color 0.2s;
        }
        .tryon-close:hover { color: #000; }
        .tryon-body {
          padding: 28px; overflow-y: auto; flex: 1;
        }
        .tryon-product-preview {
          display: flex; gap: 14px; align-items: center;
          padding: 14px; background: #f6f6f6; margin-bottom: 28px;
        }
        .tryon-product-preview img {
          width: 56px; height: 70px; object-fit: cover;
        }
        .tryon-product-preview .name {
          font-size: 13px; font-weight: 600; color: #000; margin-bottom: 4px;
        }
        .tryon-product-preview .sku {
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999;
        }
        .tryon-step {
          font-size: 16px; font-weight: 600; color: #000;
          margin-bottom: 6px;
        }
        .tryon-step-desc {
          color: #888; font-size: 13px; margin-bottom: 22px; line-height: 1.5;
        }
        .tryon-upload {
          border: 1px dashed #ccc;
          padding: 44px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #fff;
          display: block;
        }
        .tryon-upload:hover {
          border-color: #000;
          background: #fafafa;
        }
        .tryon-upload-icon {
          font-size: 28px; margin-bottom: 12px; color: #000; opacity: 0.7;
        }
        .tryon-upload-text {
          font-size: 13px; letter-spacing: 0.5px; color: #000;
        }
        .tryon-upload-hint {
          font-size: 11px; color: #999; margin-top: 8px; letter-spacing: 0.5px;
        }
        .tryon-preview {
          width: 100%; max-height: 420px;
          background: #f6f6f6;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .tryon-preview img { max-width: 100%; max-height: 420px; object-fit: contain; }
        .tryon-loader {
          text-align: center; padding: 60px 20px;
        }
        .tryon-spinner {
          width: 30px; height: 30px;
          border: 2px solid #ebebeb; border-top-color: #000;
          border-radius: 50%;
          animation: tryonSpin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes tryonSpin { to { transform: rotate(360deg); } }
        .tryon-loader-text {
          font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #888;
        }
        .tryon-error {
          color: #000; font-size: 13px; text-align: center;
          padding: 22px; background: #f6f6f6; border: 1px solid #ebebeb;
        }
        .tryon-footer {
          padding: 20px 28px;
          border-top: 1px solid #ebebeb;
          display: flex; gap: 12px;
        }
        .tryon-btn-primary, .tryon-btn-secondary {
          flex: 1; padding: 14px;
          font-family: inherit; font-size: 11px;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tryon-btn-primary {
          background: #000; color: #fff; border: 1px solid #000;
        }
        .tryon-btn-primary:hover { background: #333; border-color: #333; }
        .tryon-btn-secondary {
          background: #fff; color: #000; border: 1px solid #000;
        }
        .tryon-btn-secondary:hover { background: #000; color: #fff; }
        .tryon-privacy {
          font-size: 10px; color: #aaa; text-align: center;
          margin-top: 20px; letter-spacing: 0.5px;
        }
        #tryon-file { display: none; }
      </style>

      <div class="tryon-modal">
        <div class="tryon-header">
          <div class="tryon-title">Virtual Fitting Room</div>
          <button class="tryon-close" aria-label="Close">×</button>
        </div>

        <div class="tryon-body">
          <div class="tryon-product-preview">
            <img src="${product.imageUrl}" alt="">
            <div>
              <div class="name">${product.name || document.title || 'Product'}</div>
              <div class="sku">SKU · ${product.productId}</div>
            </div>
          </div>

          <div id="tryon-step-upload">
            <div class="tryon-step">Upload your photo</div>
            <div class="tryon-step-desc">
              For the best result, use a clear front-facing photo against a plain background.
            </div>
            <label for="tryon-file" class="tryon-upload">
              <div class="tryon-upload-icon">⬆</div>
              <div class="tryon-upload-text">Choose a photo or drag here</div>
              <div class="tryon-upload-hint">JPG or PNG · Max 10 MB</div>
            </label>
            <input type="file" id="tryon-file" accept="image/jpeg,image/png,image/webp">
          </div>

          <div id="tryon-step-processing" style="display:none">
            <div class="tryon-loader">
              <div class="tryon-spinner"></div>
              <div class="tryon-loader-text">AI is styling your look…</div>
              <div style="font-size:11px;color:#999;margin-top:12px">Usually takes 10–20 seconds</div>
            </div>
          </div>

          <div id="tryon-step-result" style="display:none">
            <div class="tryon-step">Your look</div>
            <div class="tryon-step-desc">Here's how this piece looks on you.</div>
            <div class="tryon-preview">
              <img id="tryon-result-img" src="" alt="Try-on result">
            </div>
          </div>

          <div id="tryon-step-error" style="display:none">
            <div class="tryon-error" id="tryon-error-msg">Something went wrong. Please try again.</div>
          </div>

          <div class="tryon-privacy">
            🔒 Your photo is processed securely and deleted within 60 minutes
          </div>
        </div>

        <div class="tryon-footer" id="tryon-footer-upload">
          <button class="tryon-btn-secondary tryon-close-btn">Cancel</button>
        </div>

        <div class="tryon-footer" id="tryon-footer-result" style="display:none">
          <button class="tryon-btn-secondary" id="tryon-retry">Try Another Photo</button>
          <button class="tryon-btn-primary" id="tryon-add-cart">Add to Bag</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // ── Close handlers ──────────────────────────────────────────────────
    const close = () => overlay.remove();
    overlay.querySelector('.tryon-close').onclick = close;
    overlay.querySelector('.tryon-close-btn').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    // ── File upload ─────────────────────────────────────────────────────
    const fileInput = overlay.querySelector('#tryon-file');
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) runTryOn(file, product, false);
    };

    // Drag-and-drop on the upload label
    const uploadLabel = overlay.querySelector('.tryon-upload');
    uploadLabel.ondragover = (e) => { e.preventDefault(); uploadLabel.style.borderColor = '#1a1a1a'; };
    uploadLabel.ondragleave = () => { uploadLabel.style.borderColor = '#b5a98e'; };
    uploadLabel.ondrop = (e) => {
      e.preventDefault();
      uploadLabel.style.borderColor = '#b5a98e';
      const file = e.dataTransfer.files[0];
      if (file) runTryOn(file, product, false);
    };

    overlay.querySelector('#tryon-retry').onclick = () => {
      showStep('upload');
      fileInput.value = '';
    };

    overlay.querySelector('#tryon-add-cart').onclick = () => {
      close();
      // Brands can hook into window.TryOnWidget.onAddToCart
      if (typeof window.TryOnWidget?.onAddToCart === 'function') {
        window.TryOnWidget.onAddToCart(product);
      }
    };
  }

  // ---------- 5. STEP MANAGEMENT ----------
  function showStep(step) {
    const overlay = document.getElementById('tryon-overlay');
    if (!overlay) return;

    overlay.querySelector('#tryon-step-upload').style.display = step === 'upload' ? 'block' : 'none';
    overlay.querySelector('#tryon-step-processing').style.display = step === 'processing' ? 'block' : 'none';
    overlay.querySelector('#tryon-step-result').style.display = step === 'result' ? 'block' : 'none';
    overlay.querySelector('#tryon-step-error').style.display = step === 'error' ? 'block' : 'none';

    overlay.querySelector('#tryon-footer-upload').style.display = step === 'upload' || step === 'error' ? 'flex' : 'none';
    overlay.querySelector('#tryon-footer-result').style.display = step === 'result' ? 'flex' : 'none';
  }

  // ---------- 6. TRY-ON API CALL ----------
  async function runTryOn(file, product, useSample) {
    showStep('processing');

    try {
      const fd = new FormData();
      if (file) fd.append('photo', file);
      fd.append('productId', product.productId || '');
      fd.append('garmentImageUrl', product.imageUrl);
      fd.append('brandId', brandId);
      fd.append('useSample', useSample ? 'true' : 'false');

      const res = await fetch(`${API_BASE}/api/tryon`, {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const overlay = document.getElementById('tryon-overlay');
      overlay.querySelector('#tryon-result-img').src = data.resultImage;
      showStep('result');
    } catch (err) {
      console.error('[TryOn] Error:', err);
      const overlay = document.getElementById('tryon-overlay');
      if (overlay) {
        overlay.querySelector('#tryon-error-msg').textContent =
          err.message || 'Something went wrong. Please try again.';
      }
      showStep('error');
    }
  }

  // ---------- 7. INIT ----------
  function init() {
    let products = detectManual();
    if (products.length === 0) products = detectAuto();

    // Listing-page cards are detected additively — a "related products"
    // grid can co-exist with a single main product on the same page.
    const gridProducts = detectGrid();

    if (products.length === 0 && gridProducts.length === 0) {
      console.log('[TryOn] No product detected on this page');
      return;
    }

    products.forEach(injectButton);
    gridProducts.forEach(injectCardButton);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run when listing pages lazy-load or paginate in more cards.
  // Duplicate-guards in the inject functions make this safe to call often.
  let reinitTimer = null;
  const observer = new MutationObserver(() => {
    if (reinitTimer) return;
    reinitTimer = setTimeout(() => { reinitTimer = null; init(); }, 400);
  });
  const startObserving = () => observer.observe(document.body, { childList: true, subtree: true });
  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving);

  // Shopify SPA navigation hooks
  document.addEventListener('shopify:section:load', init);
  window.addEventListener('popstate', init);

})();
