/* Noor Fabrics — sample storefront script (vanilla JS, works from file://) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  /* ---------- Product data (single source of truth) ---------- */
  var PRODUCTS = [
    { id: 'mystic-forest', name: 'Mystic Forest Bandhani', fabric: 'Lawn', technique: 'Bandhani', price: 1650, colour: 'green',
      colourNote: 'Deep teal-green ground with saffron and ivory bandhani dots', gender: ['women'], badge: 'new', best: false,
      focus: '45% 40%', ctx: 'hero-2', rating: 4.9, reviews: 38,
      desc: 'Fine summer lawn, hand-tied in thousands of tiny knots and dyed in a deep forest teal. Each dot opens into a saffron and ivory bloom, so no two meters are exactly alike. Made for kurtas, dupattas and flowing summer shirts.' },
    { id: 'ocean-wave', name: 'Ocean Wave Shibori', fabric: 'Cotton', technique: 'Shibori', price: 1850, colour: 'blue',
      colourNote: 'Natural indigo with soft ivory wave stripes', gender: ['men', 'women'], badge: '', best: true,
      focus: '30% 50%', ctx: 'story-dyeing', rating: 4.8, reviews: 52,
      desc: 'Medium-weight cotton folded, clamped and dipped in our indigo vats until the colour deepens to a rich ocean blue. The resist leaves soft ivory waves that look beautiful on shirts, kurtas and relaxed trousers.' },
    { id: 'sunset-bloom', name: 'Sunset Bloom Bandhani', fabric: 'Lawn', technique: 'Bandhani', price: 1450, oldPrice: 1750, colour: 'orange',
      colourNote: 'Warm marigold orange with white bloom motifs', gender: ['women'], badge: 'sale', best: true,
      focus: '50% 35%', ctx: 'hero-2', rating: 4.7, reviews: 29,
      desc: 'Airy lawn in a glowing marigold, tied by hand into delicate flower-like bandhani motifs. A festive favourite for mehndi outfits, dupattas and summer shirts.' },
    { id: 'rainbow-spiral', name: 'Rainbow Spiral Tie-Dye', fabric: 'Cotton', technique: 'Tie-Dye', price: 1350, colour: 'multi',
      colourNote: 'Full-spectrum spiral: fuchsia, sunshine yellow, green and royal blue', gender: ['men', 'women'], badge: 'new', best: false,
      focus: '50% 50%', ctx: 'hero-1', rating: 4.6, reviews: 21,
      desc: 'Soft breathable cotton twisted into a classic spiral and hand-dyed in bold, saturated colour. Playful and joyful for casual shirts, co-ord sets and kids\u2019 wear.' },
    { id: 'earth-tones', name: 'Earth Tones Linen', fabric: 'Linen', technique: 'Garment-dyed', price: 2200, colour: 'beige',
      colourNote: 'Undyed-look sand and oat beige with a natural slub', gender: ['men', 'women'], badge: '', best: true,
      focus: '50% 60%', ctx: 'hero-1', rating: 4.9, reviews: 44,
      desc: 'Pure linen washed in a gentle earth-tone dye bath for a soft, lived-in hand feel. A calm neutral that pairs with our bolder bandhani prints, perfect for men\u2019s kurtas and women\u2019s co-ords.' },
    { id: 'bright-sunset', name: 'Bright Sunset Ombre', fabric: 'Silk', technique: 'Ombre dip-dye', price: 2950, colour: 'red',
      colourNote: 'Graduated ombre from sun yellow to deep crimson', gender: ['women'], badge: 'new', best: false,
      focus: '50% 50%', ctx: 'hero-1', rating: 5.0, reviews: 17,
      desc: 'Lustrous silk dip-dyed by hand so the colour melts from bright yellow into a deep sunset red. Designed for formal dupattas, evening shirts and bridal-season pieces.' },
    { id: 'purple-haze', name: 'Purple Haze Bandhani', fabric: 'Chiffon', technique: 'Bandhani', price: 1750, oldPrice: 2100, colour: 'purple',
      colourNote: 'Royal purple with ivory leaf-pattern bandhani', gender: ['women'], badge: 'sale', best: true,
      focus: '50% 50%', ctx: 'hero-2', rating: 4.8, reviews: 33,
      desc: 'Weightless chiffon in royal purple, finished with a traditional leaf-trellis bandhani in ivory. Drapes beautifully as a dupatta or an overlay for formal wear.' },
    { id: 'midnight-galaxy', name: 'Midnight Galaxy Shibori', fabric: 'Cotton', technique: 'Shibori', price: 1950, colour: 'navy',
      colourNote: 'Midnight indigo with scattered ivory starburst rings', gender: ['men'], badge: 'new', best: false,
      focus: '50% 55%', ctx: 'story-dyeing', rating: 4.9, reviews: 26,
      desc: 'Dense cotton dyed many times in indigo for a near-black midnight shade, with hand-bound starburst rings. A striking choice for men\u2019s kurtas, waistcoats and shirts.' }
  ];
  var COLOURS = {
    green: { label: 'Green', hex: '#2f6b60' }, blue: { label: 'Indigo Blue', hex: '#2c4f80' }, orange: { label: 'Orange', hex: '#d27a35' },
    multi: { label: 'Multicolour', hex: 'conic-gradient(#d23c6e,#f2c230,#3aa65a,#2c64b8,#d23c6e)' }, beige: { label: 'Beige', hex: '#d9c8a9' },
    red: { label: 'Red', hex: '#b8382c' }, purple: { label: 'Purple', hex: '#5b3b78' }, navy: { label: 'Navy', hex: '#1e2742' }
  };
  var CTX_ALT = { 'hero-1': 'Bolts of fabric stacked on shelves', 'hero-2': 'Bandhani fabric hanging to dry after dyeing', 'story-dyeing': 'Artisan dipping fabric into an indigo dye vat' };
  var FREE_SHIP = 5000, SHIP_FEE = 250;
  window.NOOR_PRODUCTS = PRODUCTS;

  /* ---------- Helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function rs(n) { return 'Rs. ' + Math.round(n).toLocaleString('en-US'); }
  function img(id) { return 'images/product-' + id + '.jpg'; }
  function find(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function params() { var o = {}; location.search.replace(/^\?/, '').split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); o[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' ')); }); return o; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function fmtM(q) { return (q % 1 ? q.toFixed(1) : q) + ' m'; }
  var ICON = {
    heart: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z"/></svg>',
    bag: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    minus: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    plus: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    star: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/></svg>'
  };
  function stars(n) { var s = ''; for (var i = 0; i < 5; i++) s += ICON.star; return '<span class="stars" aria-label="Rated ' + n + ' out of 5">' + s + '</span>'; }
  function priceHTML(p, perClass) {
    var per = ' <span class="per">/ meter</span>';
    if (p.oldPrice) return '<p class="price price--sale"><s>' + rs(p.oldPrice) + '</s><span class="now">' + rs(p.price) + '</span>' + per + '</p>';
    return '<p class="price">' + rs(p.price) + per + '</p>';
  }
  var toastT;
  function toast(msg) {
    var t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- Cart & wishlist ---------- */
  function getCart() { var c = store('noor_cart'); return Array.isArray(c) ? c.filter(function (l) { return find(l.id); }) : []; }
  function setCart(c) { store('noor_cart', c); updateCounts(); renderDrawer(); document.dispatchEvent(new CustomEvent('cart:change')); }
  function addToCart(id, qty) {
    qty = Math.max(1, parseFloat(qty) || 1); var c = getCart(), line = null;
    c.forEach(function (l) { if (l.id === id) line = l; });
    if (line) line.qty = Math.min(500, line.qty + qty); else c.push({ id: id, qty: qty });
    setCart(c); openDrawer();
  }
  function setQty(id, qty) { var c = getCart(); c.forEach(function (l) { if (l.id === id) l.qty = Math.min(500, Math.max(1, qty)); }); setCart(c); }
  function removeLine(id) { setCart(getCart().filter(function (l) { return l.id !== id; })); }
  function totals() {
    var sub = 0, m = 0; getCart().forEach(function (l) { var p = find(l.id); sub += p.price * l.qty; m += l.qty; });
    var ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_FEE; return { sub: sub, ship: ship, total: sub + ship, meters: m };
  }
  function getWish() { var w = store('noor_wish'); return Array.isArray(w) ? w : []; }
  function toggleWish(id) {
    var w = getWish(), i = w.indexOf(id); if (i > -1) w.splice(i, 1); else w.push(id); store('noor_wish', w); updateCounts();
    $$('[data-wish="' + id + '"]').forEach(function (b) { b.setAttribute('aria-pressed', i === -1 ? 'true' : 'false'); });
    toast(i === -1 ? 'Saved to your wishlist' : 'Removed from your wishlist');
  }
  function updateCounts() {
    var n = getCart().length, w = getWish().length;
    $$('[data-cart-count]').forEach(function (e) { e.textContent = n; e.setAttribute('data-zero', n ? 'false' : 'true'); });
    $$('[data-wish-count]').forEach(function (e) { e.textContent = w; e.setAttribute('data-zero', w ? 'false' : 'true'); });
  }

  /* ---------- Product card ---------- */
  function card(p) {
    var wished = getWish().indexOf(p.id) > -1;
    var badge = p.badge === 'new' ? '<span class="badge">New</span>' : p.badge === 'sale' ? '<span class="badge badge--sale">Sale</span>' : '';
    return '<article class="card reveal"><div class="card__top">' +
      '<a class="card__media" href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true" style="--fo:' + p.focus + '">' +
      '<img class="main" src="' + img(p.id) + '" alt="" loading="lazy"><img class="alt" src="' + img(p.id) + '" alt="" loading="lazy"></a>' +
      badge +
      '<button class="wish" type="button" data-wish="' + p.id + '" aria-pressed="' + wished + '" aria-label="Add ' + esc(p.name) + ' to wishlist">' + ICON.heart + '</button>' +
      '<button class="quick" type="button" data-add="' + p.id + '" aria-label="Add 1 meter of ' + esc(p.name) + ' to cart">' + ICON.bag + '<span>Add to Cart</span></button></div>' +
      '<div class="card__body"><span class="card__fabric">' + p.fabric + ' &middot; ' + p.technique + '</span>' +
      '<h3 class="card__name"><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' + priceHTML(p) + '</div></article>';
  }
  function fillGrid(el, list) { el.innerHTML = list.map(card).join(''); observe(el); }

  /* ---------- Global UI ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : e.target.parentNode;
    var add = t.closest('[data-add]'); if (add) { e.preventDefault(); var p = find(add.getAttribute('data-add')); addToCart(p.id, 1); return; }
    var wish = t.closest('[data-wish]'); if (wish) { e.preventDefault(); toggleWish(wish.getAttribute('data-wish')); return; }
    if (t.closest('[data-open-cart]')) { e.preventDefault(); openDrawer(); return; }
    if (t.closest('[data-close-drawer]')) { closeDrawer(); return; }
    if (t.closest('[data-account]')) { e.preventDefault(); toast('Customer accounts are not part of this sample site'); return; }
    var dq = t.closest('[data-dqty]'); if (dq) { var id = dq.getAttribute('data-id'), l = getCart().filter(function (x) { return x.id === id; })[0]; if (l) setQty(id, l.qty + parseFloat(dq.getAttribute('data-dqty'))); return; }
    var rm = t.closest('[data-remove]'); if (rm) { removeLine(rm.getAttribute('data-remove')); toast('Removed from cart'); return; }
  });

  function initHeader() {
    var sBtn = $('[data-search-toggle]'), panel = $('.search-panel');
    if (sBtn && panel) sBtn.addEventListener('click', function (e) { e.preventDefault(); var o = panel.classList.toggle('open'); sBtn.setAttribute('aria-expanded', o); if (o) $('input', panel).focus(); });
    var mnav = $('.mnav'), burger = $('.burger');
    function closeM() { mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    if (burger && mnav) {
      burger.addEventListener('click', function () { mnav.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); $('.mnav__close', mnav).focus(); });
      $$('.mnav__bg, .mnav__close', mnav).forEach(function (b) { b.addEventListener('click', closeM); });
    }
    var dd = $('.has-drop > button');
    if (dd) dd.addEventListener('click', function () { var li = dd.parentNode, o = li.classList.toggle('open'); dd.setAttribute('aria-expanded', o); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (mnav) closeM(); closeDrawer(); if (panel) panel.classList.remove('open');
      var li = $('.has-drop.open'); if (li) li.classList.remove('open');
      var f = $('.filters.open'); if (f) f.classList.remove('open');
    });
  }

  /* ---------- Mini cart drawer ---------- */
  function renderDrawer() {
    var d = $('.drawer'); if (!d) return;
    var c = getCart(), tt = totals(), box = $('.drawer__items', d), foot = $('.drawer__foot', d);
    $('.drawer__top h2', d).innerHTML = 'Your Cart <span class="muted" style="font-family:var(--sans);font-size:14px">(' + c.length + ')</span>';
    if (!c.length) { box.innerHTML = '<div class="drawer-empty">' + ICON.bag + '<p>Your cart is empty.</p><a class="btn btn--ghost" href="shop.html">Browse fabrics</a></div>'; foot.hidden = true; return; }
    foot.hidden = false;
    box.innerHTML = c.map(function (l) {
      var p = find(l.id);
      return '<div class="ditem"><img src="' + img(p.id) + '" alt="' + esc(p.name) + '"><div><h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3><p class="muted">' + p.fabric + ' &middot; ' + rs(p.price) + ' / m</p>' +
        '<div class="stepper stepper--sm"><button type="button" data-dqty="-0.5" data-id="' + p.id + '" aria-label="Decrease meters">' + ICON.minus + '</button><input type="text" readonly value="' + l.qty + '" aria-label="Meters"><button type="button" data-dqty="0.5" data-id="' + p.id + '" aria-label="Increase meters">' + ICON.plus + '</button></div></div>' +
        '<div style="text-align:right"><p style="margin:0 0 8px">' + rs(p.price * l.qty) + '</p><button class="rm" type="button" data-remove="' + p.id + '" aria-label="Remove ' + esc(p.name) + '">' + ICON.trash + '</button></div></div>';
    }).join('');
    var left = FREE_SHIP - tt.sub;
    $('[data-d-sub]', d).textContent = rs(tt.sub);
    $('[data-d-note]', d).textContent = left > 0 ? 'Add ' + rs(left) + ' more for free delivery across Pakistan.' : 'Your order qualifies for free delivery.';
  }
  var lastFocus;
  function openDrawer() { var d = $('.drawer'); if (!d) return; lastFocus = document.activeElement; renderDrawer(); d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); setTimeout(function () { $('.drawer__close', d).focus(); }, 50); }
  function closeDrawer() { var d = $('.drawer'); if (!d || !d.classList.contains('open')) return; d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); if (lastFocus) lastFocus.focus(); }

  /* ---------- Reveal on scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -40px 0px' }) : null;
  function observe(root) { $$('.reveal:not(.in)', root).forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); }); }

  /* ---------- Home ---------- */
  function initHome() {
    var na = $('[data-grid="new"]'), bs = $('[data-grid="best"]');
    if (na) fillGrid(na, PRODUCTS.filter(function (p) { return p.badge === 'new'; }).slice(0, 4));
    if (bs) fillGrid(bs, PRODUCTS.filter(function (p) { return p.best; }).slice(0, 4));
  }

  /* ---------- Newsletter / generic forms ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^(\+?92|0)?\s?3\d{2}[\s-]?\d{7}$/;
  function initNewsletter() {
    $$('[data-newsletter]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault(); var i = $('input', f), n = f.parentNode.querySelector('.form-note');
        if (!EMAIL.test(i.value.trim())) { n.className = 'form-note err'; n.textContent = 'Please enter a valid email address.'; i.focus(); return; }
        n.className = 'form-note ok'; n.textContent = 'Thank you! You\u2019re on the list. Look out for new drops and 10% off your first order.'; f.reset();
      });
    });
  }
  function validateField(field) {
    var el = $('input, select, textarea', field); if (!el) return true;
    var v = (el.value || '').trim(), ok = true;
    if (el.required && !v) ok = false;
    else if (v && el.type === 'email' && !EMAIL.test(v)) ok = false;
    else if (v && el.getAttribute('data-phone') !== null && !PHONE.test(v.replace(/\s+/g, ' '))) ok = false;
    else if (v && el.type === 'number') { var n = parseFloat(v); if (isNaN(n) || (el.min && n < parseFloat(el.min)) || (el.max && n > parseFloat(el.max))) ok = false; }
    else if (el.minLength > 0 && v && v.length < el.minLength) ok = false;
    field.classList.toggle('invalid', !ok); el.setAttribute('aria-invalid', !ok);
    return ok;
  }
  function validateAll(root) {
    var first = null; $$('.field', root).forEach(function (f) { if (!validateField(f) && !first) first = f; });
    if (first) $('input, select, textarea', first).focus(); return !first;
  }
  function liveValidate(root) { $$('.field', root).forEach(function (f) { var el = $('input, select, textarea', f); if (el) el.addEventListener('blur', function () { if (el.value) validateField(f); }); el && el.addEventListener('input', function () { if (f.classList.contains('invalid')) validateField(f); }); }); }

  /* ---------- Shop ---------- */
  function initShop() {
    var grid = $('[data-grid="shop"]'); if (!grid) return;
    var q = params(), state = { fabric: [], gender: [], colour: [], max: 3000, sale: false, isNew: false, q: (q.q || '').trim(), sort: 'featured', wish: q.wish === '1' };
    var cat = (q.cat || '').toLowerCase();
    if (['lawn', 'cotton', 'silk', 'linen', 'chiffon'].indexOf(cat) > -1) state.fabric.push(cat);
    if (cat === 'men' || cat === 'women') state.gender.push(cat);
    if (cat === 'sale') state.sale = true; if (cat === 'new') state.isNew = true;
    // counts
    $$('[data-f-fabric]').forEach(function (cb) { var v = cb.value; cb.checked = state.fabric.indexOf(v) > -1; var n = PRODUCTS.filter(function (p) { return p.fabric.toLowerCase() === v; }).length; $('.n', cb.parentNode).textContent = n; });
    $$('[data-f-gender]').forEach(function (cb) { var v = cb.value; cb.checked = state.gender.indexOf(v) > -1; var n = PRODUCTS.filter(function (p) { return p.gender.indexOf(v) > -1; }).length; $('.n', cb.parentNode).textContent = n; });
    var sw = $('[data-swatches]');
    sw.innerHTML = Object.keys(COLOURS).map(function (k) { return '<button type="button" class="sw" data-colour="' + k + '" aria-pressed="false" title="' + COLOURS[k].label + '" aria-label="' + COLOURS[k].label + '" style="background:' + COLOURS[k].hex + '"></button>'; }).join('');
    var saleCb = $('[data-f-sale]'), newCb = $('[data-f-new]'), range = $('[data-f-price]'), rv = $('[data-price-val]'), sort = $('[data-sort]'), sIn = $('[data-shop-search]');
    saleCb.checked = state.sale; newCb.checked = state.isNew; if (sIn) sIn.value = state.q;
    function apply() {
      var list = PRODUCTS.filter(function (p) {
        if (state.fabric.length && state.fabric.indexOf(p.fabric.toLowerCase()) < 0) return false;
        if (state.gender.length && !state.gender.some(function (g) { return p.gender.indexOf(g) > -1; })) return false;
        if (state.colour.length && state.colour.indexOf(p.colour) < 0) return false;
        if (p.price > state.max) return false;
        if (state.sale && !p.oldPrice) return false;
        if (state.isNew && p.badge !== 'new') return false;
        if (state.wish && getWish().indexOf(p.id) < 0) return false;
        if (state.q) { var hay = (p.name + ' ' + p.fabric + ' ' + p.technique + ' ' + p.colourNote + ' ' + COLOURS[p.colour].label).toLowerCase(); if (state.q.toLowerCase().split(/\s+/).some(function (w) { return hay.indexOf(w) < 0; })) return false; }
        return true;
      });
      if (state.sort === 'low') list.sort(function (a, b) { return a.price - b.price; });
      if (state.sort === 'high') list.sort(function (a, b) { return b.price - a.price; });
      if (state.sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (state.sort === 'new') list.sort(function (a, b) { return (b.badge === 'new') - (a.badge === 'new'); });
      $('[data-count]').textContent = list.length + (list.length === 1 ? ' fabric' : ' fabrics');
      var title = $('[data-shop-title]');
      if (title) title.textContent = state.wish ? 'Your Wishlist' : state.q ? 'Results for \u201c' + state.q + '\u201d' : state.fabric.length === 1 && !state.gender.length ? state.fabric[0].charAt(0).toUpperCase() + state.fabric[0].slice(1) + ' Fabrics' : state.gender.length === 1 && !state.fabric.length ? (state.gender[0] === 'men' ? 'Men\u2019s Fabrics' : 'Women\u2019s Fabrics') : 'Shop All Fabrics';
      // chips
      var chips = [];
      if (state.q) chips.push(['q', '', 'Search: ' + state.q]);
      if (state.wish) chips.push(['wish', '', 'Wishlist only']);
      state.fabric.forEach(function (f) { chips.push(['fabric', f, f.charAt(0).toUpperCase() + f.slice(1)]); });
      state.gender.forEach(function (g) { chips.push(['gender', g, g === 'men' ? 'Men' : 'Women']); });
      state.colour.forEach(function (c) { chips.push(['colour', c, COLOURS[c].label]); });
      if (state.max < 3000) chips.push(['max', '', 'Under ' + rs(state.max)]);
      if (state.sale) chips.push(['sale', '', 'On sale']); if (state.isNew) chips.push(['isNew', '', 'New arrivals']);
      $('[data-chips]').innerHTML = chips.map(function (c) { return '<button type="button" class="chip" data-chip="' + c[0] + '" data-v="' + esc(c[1]) + '">' + esc(c[2]) + ' ' + ICON.close + '</button>'; }).join('');
      if (!list.length) { grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><h3>No fabrics match</h3><p class="muted">' + (state.wish ? 'Tap the heart on any fabric to save it here.' : 'Try removing a filter or searching for something else.') + '</p><button type="button" class="btn btn--ghost" data-clear>Clear all filters</button></div>'; return; }
      fillGrid(grid, list);
    }
    function bindCb(sel, key) { $$(sel).forEach(function (cb) { cb.addEventListener('change', function () { var a = state[key], i = a.indexOf(cb.value); if (cb.checked && i < 0) a.push(cb.value); if (!cb.checked && i > -1) a.splice(i, 1); apply(); }); }); }
    bindCb('[data-f-fabric]', 'fabric'); bindCb('[data-f-gender]', 'gender');
    sw.addEventListener('click', function (e) { var b = e.target.closest('.sw'); if (!b) return; var c = b.getAttribute('data-colour'), i = state.colour.indexOf(c); if (i > -1) state.colour.splice(i, 1); else state.colour.push(c); b.setAttribute('aria-pressed', i < 0); apply(); });
    range.addEventListener('input', function () { state.max = +range.value; rv.textContent = rs(state.max); apply(); });
    saleCb.addEventListener('change', function () { state.sale = saleCb.checked; apply(); });
    newCb.addEventListener('change', function () { state.isNew = newCb.checked; apply(); });
    sort.addEventListener('change', function () { state.sort = sort.value; apply(); });
    if (sIn) $('[data-shop-search-form]').addEventListener('submit', function (e) { e.preventDefault(); state.q = sIn.value.trim(); apply(); });
    function clearAll() { state.fabric = []; state.gender = []; state.colour = []; state.max = 3000; state.sale = state.isNew = state.wish = false; state.q = ''; if (sIn) sIn.value = ''; $$('.filters input[type=checkbox]').forEach(function (c) { c.checked = false; }); $$('.sw').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); range.value = 3000; rv.textContent = rs(3000); apply(); }
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-clear]')) { clearAll(); return; }
      var ch = e.target.closest('[data-chip]'); if (!ch) return;
      var k = ch.getAttribute('data-chip'), v = ch.getAttribute('data-v');
      if (k === 'q') { state.q = ''; if (sIn) sIn.value = ''; }
      else if (k === 'max') { state.max = 3000; range.value = 3000; rv.textContent = rs(3000); }
      else if (k === 'sale' || k === 'isNew' || k === 'wish') { state[k] = false; if (k === 'sale') saleCb.checked = false; if (k === 'isNew') newCb.checked = false; }
      else { state[k].splice(state[k].indexOf(v), 1); var cb = $('.filters input[value="' + v + '"]'); if (cb) cb.checked = false; var b = $('.sw[data-colour="' + v + '"]'); if (b) b.setAttribute('aria-pressed', 'false'); }
      apply();
    });
    var fb = $('.filter-btn'), fl = $('.filters');
    fb.addEventListener('click', function () { fl.classList.add('open'); $('.filters__close', fl).focus(); });
    $$('.filters__close, [data-filters-done]', fl).forEach(function (b) { b.addEventListener('click', function () { fl.classList.remove('open'); fb.focus(); }); });
    apply();
  }

  /* ---------- Product page ---------- */
  function initProduct() {
    var root = $('[data-pdp]'); if (!root) return;
    var p = find(params().id || '') ;
    if (!p) { root.innerHTML = '<div class="nf" style="grid-column:1/-1"><div class="big">?</div><h1>Fabric not found</h1><p>This fabric may have sold out or the link is incomplete.</p><div class="btn-row"><a class="btn" href="shop.html">Back to the shop</a></div></div>'; return; }
    document.title = p.name + ' | Noor Fabrics';
    var shots = [
      { src: img(p.id), alt: p.name + ' ' + p.fabric.toLowerCase() + ' fabric', cls: '' },
      { src: img(p.id), alt: 'Close-up of the ' + p.technique.toLowerCase() + ' detail on ' + p.name, cls: 'detail' },
      { src: 'images/' + p.ctx + '.jpg', alt: CTX_ALT[p.ctx], cls: '' }
    ];
    $('[data-crumb]').textContent = p.name;
    var wished = getWish().indexOf(p.id) > -1;
    root.innerHTML =
      '<div class="pgal"><div class="pgal__thumbs" role="list">' + shots.map(function (s, i) { return '<button type="button" role="listitem" class="thumb ' + s.cls + '" data-shot="' + i + '" aria-current="' + (i === 0) + '" aria-label="View image ' + (i + 1) + ': ' + esc(s.alt) + '" style="transform-origin:' + p.focus + '"><img src="' + s.src + '" alt="" style="transform-origin:' + p.focus + '"></button>'; }).join('') + '</div>' +
      '<div class="pgal__main" data-main><img src="' + shots[0].src + '" alt="' + esc(shots[0].alt) + '" style="transform-origin:' + p.focus + '"></div></div>' +
      '<div class="pinfo"><span class="eyebrow">' + p.fabric + ' &middot; ' + p.technique + (p.badge ? ' &middot; <span style="color:var(--accent)">' + (p.badge === 'new' ? 'New arrival' : 'On sale') + '</span>' : '') + '</span>' +
      '<h1>' + esc(p.name) + '</h1><div class="rating">' + stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' &middot; ' + p.reviews + ' reviews</span></div>' + priceHTML(p) +
      '<p class="muted">' + esc(p.desc) + '</p>' +
      '<dl class="specs"><dt>Fabric</dt><dd>' + p.fabric + '</dd><dt>Technique</dt><dd>Hand ' + p.technique.toLowerCase() + '</dd><dt>Colour</dt><dd>' + esc(p.colourNote) + '</dd><dt>Width</dt><dd>' + (p.fabric === 'Silk' || p.fabric === 'Chiffon' ? '42 inches' : '44 inches') + '</dd><dt>Ideal for</dt><dd>' + p.gender.map(function (g) { return g === 'men' ? 'Men\u2019s wear' : 'Women\u2019s wear'; }).join(', ') + '</dd></dl>' +
      '<label class="qty-label" for="qty">Quantity (meters)</label><div class="qty-row"><div class="stepper"><button type="button" data-step="-0.5" aria-label="Decrease by half a meter">' + ICON.minus + '</button><input id="qty" type="number" inputmode="decimal" min="1" max="500" step="0.5" value="2.5"><button type="button" data-step="0.5" aria-label="Increase by half a meter">' + ICON.plus + '</button></div>' +
      '<button type="button" class="btn btn--accent" data-pdp-add>' + ICON.bag + ' Add to Cart</button><button type="button" class="btn btn--ghost btn-wish" data-wish="' + p.id + '" aria-pressed="' + wished + '" aria-label="Save to wishlist">' + ICON.heart + '</button></div>' +
      '<p class="line-total" data-line aria-live="polite"></p>' +
      '<ul class="perks"><li><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>Delivered in 3\u20135 working days across Pakistan</li><li><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 20v-4h-4"/></svg>7-day easy returns on uncut fabric</li><li><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10M7 20h10M8 4v16M16 4v16M8 8l8 3M8 13l8 3"/></svg>Hand-dyed: slight variations are part of its charm</li></ul></div>';
    var qty = $('#qty'), line = $('[data-line]');
    function upd() { var v = Math.min(500, Math.max(1, Math.round((parseFloat(qty.value) || 1) * 2) / 2)); line.textContent = fmtM(v) + ' \u00d7 ' + rs(p.price) + ' = ' + rs(v * p.price); return v; }
    qty.addEventListener('change', function () { qty.value = upd(); }); qty.addEventListener('input', upd);
    $$('[data-step]', root).forEach(function (b) { b.addEventListener('click', function () { qty.value = Math.min(500, Math.max(1, (parseFloat(qty.value) || 1) + parseFloat(b.getAttribute('data-step')))); upd(); }); });
    upd();
    $('[data-pdp-add]', root).addEventListener('click', function () { addToCart(p.id, upd()); });
    var main = $('[data-main]'), mimg = $('img', main);
    $$('[data-shot]', root).forEach(function (b) { b.addEventListener('click', function () { var s = shots[+b.getAttribute('data-shot')]; mimg.src = s.src; mimg.alt = s.alt; main.className = 'pgal__main ' + s.cls; $$('[data-shot]', root).forEach(function (x) { x.setAttribute('aria-current', x === b); }); }); });
    // tabs
    var tabs = $$('.tabs__list [role="tab"]');
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); x.tabIndex = x === t ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = x !== t; }); });
      t.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; n.click(); n.focus(); } });
    });
    $('#tab-desc').innerHTML = '<p>' + esc(p.desc) + '</p><p>Every piece of ' + esc(p.name) + ' is tied, dyed, rinsed and sun-dried by hand at our Lahore workshop. Sold by the meter in half-meter steps, cut in one continuous length.</p>';
    $('#tab-care').innerHTML = '<ul><li>Composition: 100% ' + p.fabric.toLowerCase() + '</li><li>First wash separately in cold water with a mild detergent; a little colour release is normal for hand-dyed fabric.</li><li>Do not bleach or soak. Dry in shade, inside out.</li><li>Iron on the reverse at ' + (p.fabric === 'Silk' || p.fabric === 'Chiffon' ? 'low heat' : 'medium heat') + '.</li><li>Dry-clean recommended for ' + (p.fabric === 'Silk' ? 'silk' : 'formal stitched garments') + '.</li></ul>';
    $('#tab-ship').innerHTML = '<ul><li>Free delivery across Pakistan on orders over Rs. 5,000; otherwise a flat Rs. 250.</li><li>Lahore: 1\u20132 working days. Other cities: 3\u20135 working days.</li><li>Cash on delivery available nationwide.</li><li>Uncut, unwashed fabric can be returned within 7 days of delivery. Custom-dyed orders are final sale.</li></ul>';
    var rel = $('[data-grid="related"]');
    if (rel) { var r = PRODUCTS.filter(function (x) { return x.id !== p.id && (x.fabric === p.fabric || x.technique === p.technique); }); PRODUCTS.forEach(function (x) { if (x.id !== p.id && r.indexOf(x) < 0) r.push(x); }); fillGrid(rel, r.slice(0, 4)); }
  }

  /* ---------- Cart page ---------- */
  function initCartPage() {
    var root = $('[data-cart-page]'); if (!root) return;
    function render() {
      var c = getCart(), t = totals();
      if (!c.length) { root.innerHTML = '<div class="empty" style="grid-column:1/-1">' + '<h3>Your cart is empty</h3><p class="muted">Discover hand-dyed lawn, cotton, silk and linen, sold by the meter.</p><a class="btn" href="shop.html">Shop the collection</a></div>'; return; }
      var left = FREE_SHIP - t.sub, pct = Math.min(100, t.sub / FREE_SHIP * 100);
      root.innerHTML = '<div><div class="cart-head"><span>Fabric</span><span>Meters</span><span style="text-align:right">Total</span><span></span></div>' + c.map(function (l) {
        var p = find(l.id);
        return '<div class="citem"><div class="citem__prod"><a class="citem__img" href="product.html?id=' + p.id + '"><img src="' + img(p.id) + '" alt="' + esc(p.name) + '"></a><div><span class="card__fabric">' + p.fabric + ' &middot; ' + p.technique + '</span><h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3><p class="muted" style="margin:0">' + rs(p.price) + ' per meter</p></div></div>' +
          '<div class="stepper stepper--sm"><button type="button" data-dqty="-0.5" data-id="' + p.id + '" aria-label="Decrease meters of ' + esc(p.name) + '">' + ICON.minus + '</button><input type="text" readonly value="' + l.qty + '" aria-label="Meters of ' + esc(p.name) + '"><button type="button" data-dqty="0.5" data-id="' + p.id + '" aria-label="Increase meters of ' + esc(p.name) + '">' + ICON.plus + '</button></div>' +
          '<div class="citem__total">' + rs(p.price * l.qty) + '</div><button class="rm" type="button" data-remove="' + p.id + '" aria-label="Remove ' + esc(p.name) + '">' + ICON.trash + '</button></div>';
      }).join('') + '<p style="margin-top:28px"><a class="link" href="shop.html">\u2190 Continue shopping</a></p></div>' +
        '<aside class="summary" aria-label="Order summary"><h2>Order Summary</h2><div class="sum-row"><span>Subtotal (' + fmtM(t.meters) + ')</span><span>' + rs(t.sub) + '</span></div><div class="sum-row"><span>Delivery</span><span>' + (t.ship ? rs(t.ship) : 'Free') + '</span></div><div class="sum-row total"><span>Total</span><span>' + rs(t.total) + '</span></div>' +
        '<div class="ship-note">' + (left > 0 ? 'You\u2019re ' + rs(left) + ' away from free delivery.' : 'You\u2019ve unlocked free delivery across Pakistan.') + '<div class="ship-bar"><span style="width:' + pct + '%"></span></div></div>' +
        '<a class="btn btn--accent btn--block" href="checkout.html">Proceed to Checkout</a><p class="pay-note"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/></svg>Secure checkout &middot; Cash on delivery available</p></aside>';
    }
    render(); document.addEventListener('cart:change', render);
  }

  /* ---------- Checkout ---------- */
  function initCheckout() {
    var form = $('[data-checkout]'); if (!form) return;
    var sum = $('[data-co-summary]');
    function render() {
      var c = getCart(), t = totals();
      if (!c.length) { sum.innerHTML = '<p class="muted">Your cart is empty. <a class="link" href="shop.html">Shop fabrics</a></p>'; return; }
      sum.innerHTML = '<div class="mini-items">' + c.map(function (l) { var p = find(l.id); return '<div class="mini-item"><img src="' + img(p.id) + '" alt=""><div><strong>' + esc(p.name) + '</strong><span class="muted">' + fmtM(l.qty) + ' \u00d7 ' + rs(p.price) + '</span></div><span>' + rs(l.qty * p.price) + '</span></div>'; }).join('') + '</div>' +
        '<div class="sum-row"><span>Subtotal</span><span>' + rs(t.sub) + '</span></div><div class="sum-row"><span>Delivery</span><span>' + (t.ship ? rs(t.ship) : 'Free') + '</span></div><div class="sum-row total"><span>Total</span><span>' + rs(t.total) + '</span></div>';
    }
    render(); liveValidate(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!getCart().length) { toast('Your cart is empty. Add a fabric first.'); return; }
      if (!validateAll(form)) { toast('Please check the highlighted fields'); return; }
      var no = 'NF-' + (Math.floor(Math.random() * 90000) + 10000), t = totals(), name = $('#co-name').value.trim().split(' ')[0];
      store('noor_cart', []); updateCounts();
      $('[data-co-wrap]').innerHTML = '<div class="success" style="grid-column:1/-1"><div class="tick"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg></div><span class="eyebrow">Order ' + no + '</span><h2>Thank you, ' + esc(name) + '</h2><p>Your order of ' + rs(t.total) + ' has been placed (sample site: no payment was taken). We\u2019ll call to confirm within a few hours and dispatch in 1\u20132 working days.</p><a class="btn" href="shop.html">Continue shopping</a></div>';
      window.scrollTo(0, 0);
    });
  }

  /* ---------- Custom order wizard ---------- */
  function initWizard() {
    var w = $('[data-wizard]'); if (!w) return;
    var steps = $$('.step', w), dots = $$('.steps li', w), cur = 0, back = $('[data-prev]', w), next = $('[data-next]', w);
    liveValidate(w);
    function show(i, focus) {
      cur = i; steps.forEach(function (s, k) { s.classList.toggle('active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('active', k === i); d.classList.toggle('done', k < i); if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      back.style.visibility = i ? 'visible' : 'hidden'; next.textContent = i === steps.length - 1 ? 'Submit Request' : 'Continue';
      if (i === steps.length - 1) review();
      var h = $('h3', steps[i]); h.setAttribute('tabindex', '-1'); if (focus) h.focus({ preventScroll: true });
    }
    function groupOk(step) {
      var ok = true;
      $$('[data-group]', step).forEach(function (g) {
        var name = g.getAttribute('data-group'), any = $$('input[name="' + name + '"]', step).some(function (x) { return x.checked; });
        var er = $('[data-err="' + name + '"]', step); if (er) er.classList.toggle('show', !any); if (!any) ok = false;
      });
      return ok;
    }
    function val(n) { var a = $$('[name="' + n + '"]', w).filter(function (x) { return x.type === 'checkbox' || x.type === 'radio' ? x.checked : true; }).map(function (x) { return x.value; }); return a.join(', '); }
    function review() {
      $('[data-review]', w).innerHTML = [['Fabric', val('fabric')], ['Technique', val('technique')], ['Colours', val('colours')], ['Quantity', (val('meters') || '-') + ' meters'], ['Order type', val('ordertype')], ['Needed by', val('deadline') || 'Flexible']].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1] || '-') + '</dd></div>'; }).join('');
    }
    next.addEventListener('click', function () {
      var s = steps[cur], ok = groupOk(s) & validateAll(s);
      if (!ok) { var e = $('.group-err.show, .field.invalid', s); if (e) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      if (cur < steps.length - 1) { show(cur + 1, true); w.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
      var ref = 'CO-' + (Math.floor(Math.random() * 9000) + 1000), name = $('#cu-name').value.trim().split(' ')[0];
      w.innerHTML = '<div class="success" style="border:0;padding:20px 0"><div class="tick"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg></div><span class="eyebrow">Request ' + ref + '</span><h2>Thank you, ' + esc(name) + '</h2><p>Your custom order request has been received (sample site: nothing was sent). Our design team will contact you within 24 hours with swatch options and a quote.</p><a class="btn" href="shop.html">Browse ready fabrics</a></div>';
    });
    back.addEventListener('click', function () { if (cur) show(cur - 1, true); });
    $$('input[type=radio], input[type=checkbox]', w).forEach(function (x) { x.addEventListener('change', function () { var er = $('[data-err="' + x.name + '"]', w); if (er) er.classList.remove('show'); }); });
    show(0);
  }

  /* ---------- Contact ---------- */
  function initContact() {
    var f = $('[data-contact]'); if (!f) return; liveValidate(f);
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!validateAll(f)) return;
      var name = $('#c-name').value.trim().split(' ')[0];
      f.outerHTML = '<div class="success"><div class="tick"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg></div><h2>Message received</h2><p>Thank you, ' + esc(name) + '. We reply within one working day (sample site: nothing was actually sent).</p></div>';
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function initGallery() {
    var items = $$('[data-lb]'); if (!items.length) return;
    var lb = $('.lightbox'), im = $('img', lb), cap = $('p', lb), i = 0, opener;
    function open(k) { i = (k + items.length) % items.length; var it = items[i], src = $('img', it); im.src = src.getAttribute('src'); im.alt = src.alt; cap.textContent = (i + 1) + ' / ' + items.length + '  \u00b7  ' + it.getAttribute('data-lb'); }
    items.forEach(function (b, k) { b.addEventListener('click', function () { opener = b; open(k); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); }); });
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (opener) opener.focus(); }
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { open(i - 1); });
    $('.lb-next', lb).addEventListener('click', function () { open(i + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') open(i - 1); if (e.key === 'ArrowRight') open(i + 1); if (e.key === 'Tab') { var f = $$('button', lb), a = document.activeElement, x = f.indexOf(a); e.preventDefault(); f[(x + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); } });
  }

  /* ---------- Boot ---------- */
  function boot() {
    updateCounts(); initHeader(); renderDrawer();
    initHome(); initShop(); initProduct(); initCartPage(); initCheckout(); initWizard(); initContact(); initGallery(); initNewsletter();
    observe(document);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
