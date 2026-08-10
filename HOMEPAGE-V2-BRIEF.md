# realhands · Homepage v2 implementation brief · FINAL

*For the coding agent working in this repo. Target file: `project/RealHands.dc.html`. This brief maps the FINAL approved storytelling script onto the existing page. Do not touch the footer, it is already done. Do not touch `Shop.dc.html` or `Story.dc.html`.*

**Golden rules**

1. Stay inside the existing design system: background `#f4f4f2`, ink `#151310`, yellow `--rh-yellow #EDE94D`, IBM Plex Mono for labels/eyebrows/numbers, Helvetica Neue for body. Reuse existing classes and patterns (`rh-eyebrow`, `rh-reveal`, `rh-clip`, `rh-parallax`, `rh-cta`, `rh-def`) instead of inventing new ones.
2. Never use the em dash character in any copy. Use periods, commas, colons or the "·" separator.
3. The brand name is ALWAYS lowercase and bold in body copy: render as `<strong>realhands</strong>`. Never capitalize it.
4. Preserve the existing signature interactions exactly: sticky-hero curtain reveal, scroll-scrubbed `assembly.mp4`, grayscale parallax images, reveal-on-scroll cascade, reduced-motion fallbacks.
5. Copy below is final. Apply it verbatim.

**Section order (top to bottom):**
Hero → **The story (NEW)** → Dense enough to matter (`.rh-waves`, add beats) → The feeling (`.rh-life`, new headline) → The weight (`.rh-defs`, copy tweaks) → Swirl closer (add overlay) → Footer (untouched)

---

## 1 · HERO · copy adjustment only

Existing section `.rh-hero`. Keep the video, curtain reveal, title and CTA exactly as they are.

- **Replace the eyebrow text** with:

> Handmade record weights. Made to still your record, and to let your system play everything it was built for.

- Headline stays: **Engineered for Better Listening.**
- CTA stays: Discover the weights →

---

## 2 · THE STORY · NEW SECTION

**Insert directly after the hero**, as the first section of the curtain (opaque `#f4f4f2` background; verify the curtain reveal still works with this as the first covering block).

**Content (compact: label, title, one sentence, CTA):**

- Eyebrow (use `.rh-eyebrow`, yellow square marker): `THE HANDS BEHIND THE NAME`
- Title (display size, weight 800, tight leading, like other section titles):

> Made by real hands.

- One sentence below (standard body style, max-width around 60ch, brand name bold):

> Born between Beirut and Paris, each <strong>realhands</strong> weight comes from a family workshop with thirty years in stainless steel and a passion for music.

- CTA: `Read our story →` linking to `Story.dc.html`. Underlined mono link style (like `.rh-hero__discover` but dark ink), not the yellow pill.

**Design and feel:** two-column editorial split (like `st-split` on the Story page): text left, `workshop-1.jpg` right with the existing grayscale + parallax treatment (`data-parallax≈0.12`, `data-parallax-scale:1.18`). One breath, generous vertical padding, `rh-reveal` stagger.

---

## 3 · DENSE ENOUGH TO MATTER · rework of `.rh-waves`

Keep the section, the `waves2.mp4` media block and the staggered headline `Dense enough / to matter / acoustically` exactly as they are. **Add a three-beat row** below the existing media + headline grid, spanning the section width. Reuse the `.rh-def` pattern (mono number, bold title, small grey body):

**01 · Coupling.**
> 500 to 800 grams press the record into full contact with the platter. No air gap, no drum skin. One quiet interface.

**02 · Damping.**
> Vinyl rings when the stylus excites it and comes back as glare. Dense steel above the label settles it.

**03 · Flattening.**
> Most records carry a slight dish. Steady mass tames it, so the stylus tracks the groove's true path.

**Design and feel:** three equal columns on desktop (`repeat(3,1fr)`), stacking under 820px. Reveal cascade with per-item delays (.07s/.14s) like `.rh-defs__list`. The beats read as engineering notes, not marketing blocks.

---

## 4 · THE FEELING · headline swap in `.rh-life`

Keep the section, the grayscale parallax image pair (`collect.jpg` + `lifestyleimage1.png`) and the offset layout exactly as they are. One change only:

- **Replace the title lines.** Current: "Precise enough / to be beautiful / as an object." New (keep the three-span `rh-clip` cascade; suggested yellow `em` highlight on "missed"):

> Precise enough / to be missed / when it's gone.

No body copy in this section. The images carry it.

---

## 5 · THE WEIGHT · copy tweaks only in `.rh-defs`

Keep the section, the scroll-scrubbed `assembly.mp4` and the 2×2 grid exactly as they are. Replace the four definition titles and texts with:

**01 · Handcrafted, solid, 316L.**
> No molds, no shortcuts. Each piece is lathe-turned and finished by hand, so each one is uniquely yours.

**02 · More weight, less space.**
> Maximum mass in a compact form. Small enough for a record bag, present enough for the platter.

**03 · Hear more of the record.**
> Added inertia tames resonance and micro-vibration, so the needle reads every groove true.

**04 · Built to be passed down.**
> Stainless steel doesn't rust, wear, or age out. A weight you pass down, not replace.

- CTA pill text becomes: `See full specs & order →` (still links to `Shop.dc.html`).

---

## 6 · CLOSER · add overlay to `.rh-swirl`

Add a centered overlay on top of the swirl video:

- **Line (display size, off-white, bold, tight letter-spacing):**

> Still records. Real hands.

- **CTA below it:** yellow pill (`.rh-cta`): `Choose your weight` → `Shop.dc.html`

**Design and feel:** absolute-positioned overlay, centered both axes, subtle dark scrim behind the text zone (like the hero scrim but lighter), `rh-reveal` on enter. Keep the video's full-bleed behavior on mobile.

---

## 7 · FOOTER · DO NOT TOUCH

Already done on the site.

---

## QA checklist before finishing

- [ ] Curtain reveal still works with the new story section as the first covering block
- [ ] Assembly scrub and waves loop unaffected
- [ ] All new elements respect `prefers-reduced-motion`
- [ ] Mobile: story split stacks, physics beats stack, swirl overlay legible at small sizes
- [ ] No em dash character anywhere in rendered copy
- [ ] Brand name rendered lowercase bold (`<strong>realhands</strong>`) wherever it appears in body copy
- [ ] Links: story CTA → Story.dc.html, defs CTA and swirl CTA → Shop.dc.html
