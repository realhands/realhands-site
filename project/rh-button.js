/* realhands glass button · shared across pages.

   Usage: put `rh-glass` on any link or button.
     <a href="/shop.html" class="rh-glass">Discover the weights</a>
   Page-level classes are still fine alongside it for placement only
   (margins, alignment); everything about how the button LOOKS lives here, so
   editing this file restyles every one of them at once.

   The look: frosted white glass over whatever sits behind it, dark ink, and a
   single white hairline along the top edge only - no full outline, so the
   pill reads as lit from above rather than drawn. The heavy blur is what
   makes it glass, so it reads best over imagery; over a flat colour it
   resolves to a near-white pill, which is expected.

   TUNING - the --rh-glass-* values below are the whole control surface. */
(function () {
  var css = [
    '.rh-glass{',
    '  --rh-glass-tint:rgba(255,255,255,.5);',
    '  --rh-glass-tint-hi:rgba(255,255,255,.64);',
    '  --rh-glass-ink:#151310;',
    '  --rh-glass-lit:rgba(255,255,255,.65);',   /* the top hairline */
    '  --rh-glass-sheen:rgba(255,255,255,.34);',
    '  position:relative; isolation:isolate; overflow:hidden;',
    '  display:inline-flex; align-items:center; gap:8px;',
    "  font-family:'ABC Diatype Mono','IBM Plex Mono',ui-monospace,monospace;",
    '  font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase;',
    '  padding:10px 18px; border-radius:999px; border:0; cursor:pointer;',
    '  color:var(--rh-glass-ink) !important; background:var(--rh-glass-tint);',
    '  -webkit-backdrop-filter:blur(40px) saturate(180%); backdrop-filter:blur(40px) saturate(180%);',
    /* top edge only: an inset hairline, no surrounding outline */
    '  box-shadow:inset 0 1px 0 var(--rh-glass-lit);',
    '  transition:transform .15s ease, background .18s ease;}',
    /* sheen sits under the label so it lights the tint without washing the text */
    '.rh-glass::before{content:""; position:absolute; inset:0; z-index:-1; pointer-events:none;',
    '  border-radius:inherit;',
    '  background:linear-gradient(180deg, var(--rh-glass-sheen) 0%, transparent 55%);}',
    '.rh-glass:hover{color:var(--rh-glass-ink) !important; transform:translateY(-1px);',
    '  background:var(--rh-glass-tint-hi);}',
    '.rh-glass span{transition:transform .18s ease;}',
    '.rh-glass:hover span{transform:translateX(3px);}',
    /* touch: keep the visual size, grow only the hit area */
    '@media (hover:none){',
    '  .rh-glass::after{content:""; position:absolute; left:0; right:0; top:50%;',
    '    height:44px; transform:translateY(-50%);}',
    '}'
  ].join('\n');

  function ensureStyles() {
    if (document.getElementById('rh-button-style')) return;
    var s = document.createElement('style');
    s.id = 'rh-button-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureStyles);
  } else {
    ensureStyles();
  }
})();
