# NexQloud — Marketing Site

Award-caliber marketing site for NexQloud, a decentralized cloud platform. Built to Awwwards "Site of the Day" quality.

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
```

## Project Structure

```
src/
├── components/
│   ├── sections/          # One file per page section
│   │   ├── Hero.tsx       # Three.js globe + headline + CTAs
│   │   ├── Marquee.tsx    # Press logo infinite scroll
│   │   ├── ProblemSolution.tsx
│   │   ├── TrustTier.tsx  # Pinned horizontal scroll A→D
│   │   ├── Products.tsx   # Bento grid with 3D tilt
│   │   ├── Stakeholders.tsx # Tab switcher with GSAP crossfade
│   │   ├── Sustainability.tsx # Radial gauge animations
│   │   ├── NetworkStats.tsx # Odometer counters
│   │   ├── Monetization.tsx # Node earning section
│   │   ├── CaseStudies.tsx # Draggable slider with inertia
│   │   └── CTAFooter.tsx  # CTA grid + animated wordmark
│   ├── Cursor.tsx         # Custom blended cursor
│   ├── Preloader.tsx      # Counter + clip-path reveal
│   └── Navbar.tsx
├── three/
│   └── GlobeScene.ts      # Vanilla Three.js — globe, arcs, particles
├── lib/
│   └── gsap.ts            # Plugin registration + Lenis smooth scroll
├── data/
│   └── index.ts           # ALL copy/stats/config — edit here
└── styles/
    └── globals.css        # Tailwind base + design tokens as CSS utilities
```

## Editing Content

**All copy lives in `src/data/index.ts`** — no hunting through components:

- `siteConfig` — tagline, sub-headline, CTA labels
- `trustTiers[]` — each A/B/C/D tier's label, color, workloads, compliance, savings %
- `products[]` — the six product cards
- `stakeholders[]` — tab content for CIO/DevOps/Node/Sustainability/Investor
- `networkStats[]` — the odometer counter values
- `caseStudies[]` — draggable slider cards
- `globeNodes[]` — lat/lng + tier for each globe node
- `pressLogos[]` — marquee press names
- `problems[]` / `solutions[]` — problem→solution split section

## Design Tokens

Defined in `tailwind.config.js`:

| Token | Value | Usage |
|---|---|---|
| `bg-base` | `#070A1A` | Page background |
| `bg-surface` | `#0E1330` | Card surfaces |
| `accent-blue` | `#5C9CFF` | Primary accent |
| `accent-violet` | `#7B61FF` | Secondary accent |
| `tier-a` | `#22D39B` | Regulated tier |
| `tier-b` | `#2DD4BF` | Enterprise tier |
| `tier-c` | `#5C9CFF` | Edge tier |
| `tier-d` | `#9CA3FF` | Public tier |

## Reduced-Motion Strategy

Every animation checks `window.matchMedia('(prefers-reduced-motion: reduce)')`:

- **GSAP timelines**: `y/x` values set to `0`, durations compressed to `0.3s`
- **Globe**: skipped entirely; canvas still renders (static on reduced-motion)
- **Preloader**: skipped — jumps directly to `onComplete()`
- **Trust-Tier horizontal scroll**: pin disabled, section renders as vertical stack (mobile-first fallback)
- **Scroll-driven scrub**: `ScrollTrigger` still fires `onEnter` but skips transform scrub
- **CSS animations**: disabled via global `animation-duration: 0.01ms`

## Performance Notes

- Three.js is a **dynamic import** in `Hero.tsx` — loads only after preloader completes
- Vite splits `three` and `gsap` into separate chunks (~130 KB + ~49 KB gzipped)
- Globe pixel ratio capped at `2`; `IntersectionObserver` can be wired to pause RAF
- On mobile (`< 768px`), the globe is skipped (lighter particle fallback can be added)
- `will-change: transform` used only on the marquee track
