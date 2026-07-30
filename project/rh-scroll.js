/* RealHands smooth scroll — shared across pages.
   Wheel input moves a target; the page eases toward it every frame
   (snappy start, playful settle). Native behavior is kept for touch
   devices, keyboard, scrollbar drags, and reduced-motion users.
   Tune EASE (0..1): higher = snappier, lower = floatier. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // keep native momentum scrolling on touch-first devices
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  var EASE = 0.065;        // free-scroll ease (floaty)
  var EASE_SNAP = 0.065;   // same ease while snapping — one continuous quality of motion
  var SNAP_RANGE = 0.35;   // snap when a section top is within 35% of the viewport
  var SNAP_IDLE = 90;      // retarget early, while still gliding — reads as a course-correction, not a grab
  var target = window.scrollY || 0;
  var current = target;
  var raf = null;
  var lastWheel = 0;
  var snapped = true;
  var ease = EASE;

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  /* nearest section top to y, or null if none within range.
     the sticky hero is skipped (its rect lies while pinned) — 0 covers it. */
  function nearestSnap(y) {
    var tops = [0];
    var els = document.querySelectorAll('section:not(.rh-hero)');
    for (var i = 0; i < els.length; i++) {
      tops.push(els[i].getBoundingClientRect().top + window.scrollY);
    }
    var best = null, bestD = window.innerHeight * SNAP_RANGE;
    for (var j = 0; j < tops.length; j++) {
      var d = Math.abs(y - tops[j]);
      if (d < bestD) { bestD = d; best = tops[j]; }
    }
    return best === null ? null : Math.max(0, Math.min(maxScroll(), best));
  }

  function loop() {
    // once the gesture goes quiet, glide to the nearest section top
    if (!snapped && performance.now() - lastWheel > SNAP_IDLE) {
      snapped = true;
      var s = nearestSnap(target);
      if (s !== null) { target = s; ease = EASE_SNAP; }
    }
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.5 && snapped) {
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
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;      // line-mode wheels
    else if (e.deltaMode === 2) dy *= window.innerHeight;
    target = Math.max(0, Math.min(maxScroll(), target + dy));
    lastWheel = performance.now();
    snapped = false;
    ease = EASE;
    if (raf === null) raf = requestAnimationFrame(loop);
  }, { passive: false });

  // resync when scrolling happens by other means (keys, scrollbar, anchors)
  window.addEventListener('scroll', function () {
    if (raf === null) { target = current = window.scrollY; }
  }, { passive: true });
})();
