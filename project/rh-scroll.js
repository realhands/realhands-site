/* realhands smooth scroll · shared across pages.
   Wheel input moves a target; the page eases toward it every frame
   (snappy start, playful settle). Free scrolling: nothing snaps or
   pulls the page back. Native behavior is kept for touch devices,
   keyboard, scrollbar drags, and reduced-motion users.
   Tune EASE (0..1): higher = snappier, lower = floatier. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // keep native momentum scrolling on touch-first devices
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  var EASE = 0.065;        // free-scroll ease (floaty)
  var target = window.scrollY || 0;
  var current = target;
  var raf = null;

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  /* A scene that takes over the wheel can hold the page at a position while
     it runs. Cooperative on purpose: forcing scrollTo from outside fights this
     loop, which writes the scroll position every frame, and the two oscillate.
     Set window.__rhScrollLock to a Y position to hold, or null to release. */
  window.__rhScrollLock = null;

  function loop() {
    var lock = window.__rhScrollLock;
    if (lock !== null && lock !== undefined) {
      target = current = lock;
      raf = null;
      window.scrollTo({ top: lock, behavior: 'instant' });
      return;
    }
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.5) {
      current = target;
      raf = null;
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.scrollTo({ top: current, behavior: 'instant' });
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return; // pinch-zoom gesture — leave native
    e.preventDefault();
    if (window.__rhScrollLock !== null && window.__rhScrollLock !== undefined) {
      target = current = window.__rhScrollLock;
      return;
    }
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;      // line-mode wheels
    else if (e.deltaMode === 2) dy *= window.innerHeight;
    target = Math.max(0, Math.min(maxScroll(), target + dy));
    if (raf === null) raf = requestAnimationFrame(loop);
  }, { passive: false });

  // resync when scrolling happens by other means (keys, scrollbar, anchors)
  window.addEventListener('scroll', function () {
    if (raf === null) { target = current = window.scrollY; }
  }, { passive: true });
})();
