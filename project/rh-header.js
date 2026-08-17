/* RealHands shared header component.
   Usage in any page template:
     <div class="rh-header-slot" data-current="home|shop|story" data-theme="dark|light"></div>
   - data-current: which page is active (selected-state styling)
   - data-theme="light": white logo/links for use over dark imagery (landing hero)
   The script fills every slot automatically (MutationObserver — works no matter
   when the framework renders). Edit THIS file to change the header everywhere. */
(function () {
  var css = [
    '.rh-header-slot{display:block; position:sticky; top:0; z-index:90; background:transparent; transition:background .3s ease, box-shadow .3s ease, opacity .18s ease;}',
    '.rh-header-slot.rhh--hidden{opacity:0; pointer-events:none;}',
    /* hidden must beat the scroll-linked hero fade (animations override class opacity) */
    '.rh-header-slot[data-theme="light"].rhh--hidden{animation:none;}',
    '.rh-header-slot .rhh{display:flex; justify-content:space-between; align-items:center; gap:24px; padding:40px 40px 0; transition:padding .3s ease;}',
    '.rh-header-slot .rhh a{color:#151310; text-decoration:none; transition:color .18s ease;}',
    '.rh-header-slot .rhh a:hover{color:#5a5a5a;}',
    '.rh-header-slot .rhh__logo{display:flex; align-items:center; gap:13px;}',
    '.rh-header-slot .rhh__logo img{display:block; height:32px; width:auto; filter:brightness(0);}',
    '.rh-header-slot .rhh__logo img.wordmark{height:19px;}',
    ".rh-header-slot .rhh__nav{display:flex; align-items:center; gap:clamp(16px,2vw,26px); font-family:'ABC Diatype Mono','IBM Plex Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase;}",
    '.rh-header-slot .rhh__pill{padding:10px 18px; border-radius:999px; background:var(--rh-yellow,#EDE94D); color:#151310 !important; font-weight:600; display:inline-flex; align-items:center; transition:transform .15s ease, filter .15s ease;}',
    '.rh-header-slot .rhh__pill:hover{color:#151310 !important; transform:translateY(-1px); filter:brightness(1.05);}',
    '.rh-header-slot .rhh a.rhh__pill--current{background:transparent !important; text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1.5px; transform:none !important; filter:none !important;}',
    '.rh-header-slot .rhh a.rhh__link--current{text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1.5px;}',
    '.rh-header-slot[data-theme="light"] .rhh a{color:#f4f4f2;}',
    '.rh-header-slot[data-theme="light"] .rhh a:hover{color:var(--rh-yellow,#EDE94D);}',
    '.rh-header-slot[data-theme="light"] .rhh__logo img{filter:brightness(0) invert(1); transition:filter .3s ease;}',
    '.rh-header-slot[data-theme="light"] .rhh__pill{color:#151310 !important;}',
    '.rh-header-slot[data-theme="light"] .rhh__pill:hover{color:#151310 !important;}',
    /* scrolled: compact bar (no background — testing transparent) */
    '.rh-header-slot.rhh--scrolled:not([data-theme="light"]) .rhh{padding:14px 40px;}',
    /* light (hero overlay): fixed over the page, transparent; text flips dark past the hero */
    '.rh-header-slot[data-theme="light"]{position:fixed; top:0; left:0; right:0; z-index:100; background:transparent;}',
    '.rh-header-slot[data-theme="light"].rhh--past-hero .rhh{padding:14px 40px;}',
    '.rh-header-slot[data-theme="light"].rhh--past-hero .rhh a{color:#151310;}',
    '.rh-header-slot[data-theme="light"].rhh--past-hero .rhh a:hover{color:#5a5a5a;}',
    '.rh-header-slot[data-theme="light"].rhh--past-hero .rhh__logo img{filter:none;}',
    '.rh-header-slot[data-theme="light"].rhh--past-hero .rhh__pill{color:#151310 !important;}',
    /* a dark section is sitting under the header: flip the ink back to light */
    'html.rh-dark-zone .rh-header-slot .rhh a{color:#f4f4f2;}',
    'html.rh-dark-zone .rh-header-slot .rhh a:hover{color:var(--rh-yellow,#EDE94D);}',
    'html.rh-dark-zone .rh-header-slot .rhh__logo img{filter:brightness(0) invert(1);}',
    'html.rh-dark-zone .rh-header-slot .rhh a.rhh__pill{color:#151310 !important;}',
    '@media (max-width:640px){',
    '  .rh-header-slot .rhh{padding:40px 16px 0;}',
    '  .rh-header-slot.rhh--scrolled:not([data-theme="light"]) .rhh{padding:14px 16px;}',
    '  .rh-header-slot[data-theme="light"].rhh--past-hero .rhh{padding:14px 16px;}',
    '}'
  ].join('\n');

  function ensureStyles() {
    if (document.getElementById('rh-header-style')) return;
    var s = document.createElement('style');
    s.id = 'rh-header-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function render(slot) {
    var current = (slot.getAttribute('data-current') || '').toLowerCase();
    var storyCls = current === 'story' ? ' class="rhh__link--current"' : '';
    var shopCls = 'rhh__pill' + (current === 'shop' ? ' rhh__pill--current' : '');
    slot.innerHTML =
      '<header class="rhh">' +
        '<a href="/" class="rhh__logo" aria-label="realhands home">' +
          '<img src="/project/realhands-mark.png" alt="realhands mark">' +
          '<img src="/project/realhands-wordmark.png" class="wordmark" alt="realhands">' +
        '</a>' +
        '<nav class="rhh__nav">' +
          '<a href="/Story.html"' + storyCls + '>Story</a>' +
          '<a href="/Shop.html" class="' + shopCls + '">Shop</a>' +
        '</nav>' +
      '</header>';
    slot.setAttribute('data-rh-mounted', '1');
  }

  function mountAll() {
    ensureStyles();
    var slots = document.querySelectorAll('.rh-header-slot:not([data-rh-mounted])');
    for (var i = 0; i < slots.length; i++) render(slots[i]);
  }

  var lastY = window.scrollY || 0;
  var lastWheelT = 0;

  function setHidden(hidden) {
    var slots = document.querySelectorAll('.rh-header-slot');
    for (var i = 0; i < slots.length; i++) slots[i].classList.toggle('rhh--hidden', hidden);
  }

  /* header hides on any downward scroll — it is only seen at the top or on scroll-up */
  function canHide(y) {
    return y > 120;
  }

  function onScroll() {
    var y = window.scrollY || 0;
    var slots = document.querySelectorAll('.rh-header-slot');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      slot.classList.toggle('rhh--scrolled', y > 8);
      if (slot.getAttribute('data-theme') === 'light') {
        slot.classList.toggle('rhh--past-hero', y > window.innerHeight * 0.85);
      }
    }
    /* auto-hide: near the top always show; otherwise, for non-wheel input
       (touch, keys, scrollbar) fall back to scroll direction with hysteresis.
       Wheel intent (below) wins for 1.5s so snap adjustments can't flicker it. */
    if (y < 80) setHidden(false);
    else if (Date.now() - lastWheelT > 1500) {
      if (y > lastY + 8 && canHide(y)) setHidden(true);
      else if (y < lastY - 8) setHidden(false);
    }
    lastY = y;
  }

  function start() {
    mountAll();
    var mo = new MutationObserver(function () { mountAll(); onScroll(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    /* wheel intent drives hide/show on desktop: down = hide, up = show */
    window.addEventListener('wheel', function (e) {
      lastWheelT = Date.now();
      var y = window.scrollY || 0;
      if (e.deltaY > 0 && y > 120 && canHide(y)) setHidden(true);
      else if (e.deltaY < 0) setHidden(false);
    }, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
