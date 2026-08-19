/* realhands smooth scroll, with per-section weight.

   Physics, not delays. Wheel input adds velocity to a scroll position that is
   integrated every frame under friction, so a gesture has a real impulse and a
   real glide. Each section carries a weight that scales two things at once:
   how much velocity a gesture buys, and how fast that velocity bleeds off.
   Heavier sections therefore move less per gesture AND settle sooner, which is
   what "more friction" actually feels like. Nothing is ever held or delayed,
   so the page never feels stuck.

   Weight 1 is calibrated to move the page exactly as far per notch as a plain
   eased scroll would, so 1 is genuinely neutral and the numbers below read as
   multipliers against it.

   Native behaviour is kept for touch, keyboard, scrollbar drags and
   reduced-motion users. Touch is deliberately left alone: iOS momentum and
   rubber-banding are better than anything reimplemented on top of touchmove,
   and hijacking them reads as lag rather than weight.

   TUNING - edit WEIGHTS, or override per element in the markup with
   data-rh-weight="1.6" (the attribute always wins). Above 1 is heavier, below
   1 is freer. Keep the spread modest: past about 2.2 the page starts to feel
   unresponsive rather than weighty. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // touch-first devices keep native momentum scrolling
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  var WEIGHTS = [
    ['.rh-hero',  1.00],   // 1 - hero, neutral
    ['.rh-defs',  1.25],   // 2 - product scene, mildly heavy
    ['.rh-waves', 1.30],   // 3 - dense enough to matter, a touch heavy
    ['.rh-life',  0.92],   // 4 - the feeling, slightly free
    ['.rh-story', 1.20],   // 5 - closing story, a touch heavy
    ['.rh-swirl', 1.00]
  ];

  var DAMP  = 0.90;   // base velocity retained per frame at weight 1
  var FRIC  = 0.5;    // how much weight also steepens the decay (0 = distance only)
  var RAMP  = 0.07;   // per-frame approach to a new weight; lower = longer cross-fade
  var STOP  = 0.20;   // velocity below this is a full stop

  var pos = window.scrollY || 0;
  var vel = 0;
  var raf = null;
  var smoothW = 1;
  var zones = null;

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  /* Elements are cached but re-resolved whenever one goes stale: the page's
     framework re-renders and swaps nodes, and a detached node measures zero. */
  function elements() {
    var ok = zones && zones.length;
    if (ok) {
      for (var i = 0; i < zones.length; i++) {
        if (!zones[i].el.isConnected) { ok = false; break; }
      }
    }
    if (!ok) {
      zones = [];
      for (var j = 0; j < WEIGHTS.length; j++) {
        var el = document.querySelector(WEIGHTS[j][0]);
        if (!el) continue;
        var attr = parseFloat(el.getAttribute('data-rh-weight'));
        zones.push({ el: el, w: isFinite(attr) ? attr : WEIGHTS[j][1] });
      }
    }
    return zones;
  }

  /* Which section owns the middle of the screen. Rects are read live rather
     than cached, because sections here overlap by design (the hero is sticky
     and section 3 is pulled up over section 2 to make the curtain) and their
     offsets shift as the pinned scene sticks and releases. Later entries win,
     which matches paint order, so the section visually on top is the one whose
     weight applies. */
  function rawWeightAt(y) {
    var list = elements();
    var probe = y + (window.innerHeight || 0) / 2;
    var w = 1;
    for (var i = 0; i < list.length; i++) {
      var r = list[i].el.getBoundingClientRect();
      var top = r.top + window.scrollY;
      if (probe >= top && probe < top + r.height) w = list[i].w;
    }
    return w;
  }

  /* A scene that takes over the wheel can hold the page at a position while it
     runs. Cooperative on purpose: forcing scrollTo from outside fights this
     loop, which writes the scroll position every frame, and the two oscillate.
     Set window.__rhScrollLock to a Y position to hold, or null to release. */
  window.__rhScrollLock = null;

  function loop() {
    var lock = window.__rhScrollLock;
    if (lock !== null && lock !== undefined) {
      pos = lock;
      vel = 0;
      raf = null;
      window.scrollTo({ top: lock, behavior: 'instant' });
      return;
    }

    // ease toward the new weight instead of stepping onto it, so a boundary is
    // felt as the page gaining or shedding mass rather than as a gear change
    smoothW += (rawWeightAt(pos) - smoothW) * RAMP;

    vel *= Math.pow(DAMP, 1 + (smoothW - 1) * FRIC);
    pos += vel / smoothW;

    var m = maxScroll();
    if (pos < 0) { pos = 0; vel = 0; }
    else if (pos > m) { pos = m; vel = 0; }

    window.scrollTo({ top: pos, behavior: 'instant' });

    if (Math.abs(vel) < STOP) { vel = 0; raf = null; }
    else raf = requestAnimationFrame(loop);
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;                 // pinch-zoom gesture, leave native
    e.preventDefault();
    if (window.__rhScrollLock !== null && window.__rhScrollLock !== undefined) {
      pos = window.__rhScrollLock;
      vel = 0;
      return;
    }
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;                  // line-mode wheels
    else if (e.deltaMode === 2) dy *= window.innerHeight;

    if (raf === null) {
      // settled here, so adopt this section's weight rather than ramping to it
      pos = window.scrollY;
      smoothW = rawWeightAt(pos);
    }
    // (1 - DAMP) calibrates weight 1 to travel exactly dy in total
    vel += dy * (1 - DAMP);
    if (raf === null) raf = requestAnimationFrame(loop);
  }, { passive: false });

  // resync when scrolling happens by other means (keys, scrollbar, anchors)
  window.addEventListener('scroll', function () {
    if (raf === null) { pos = window.scrollY; vel = 0; }
  }, { passive: true });

  window.addEventListener('resize', function () { zones = null; });
})();
