import { useEffect, useRef } from 'react'
import type React from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

// ─── CTA section data ───────────────────────────────────────────────────────

const ctaCards = [
  {
    icon: '⬡',
    title: 'Deploy my first workload',
    desc: 'Launch compute or AI workloads on the right tier — instantly. Free tier includes 200 vCPU-hours/month.',
    cta: 'Start Free',
    accent: '#5c9cff',
    href: '#',
  },
  {
    icon: '◇',
    title: 'Contribute my infrastructure',
    desc: 'Earn by adding your idle compute to NexQloud. Setup in under 20 minutes.',
    cta: 'Become a Node',
    accent: '#22d39b',
    href: '#',
  },
  {
    icon: '⬢',
    title: 'Explore enterprise solutions',
    desc: 'See how NexQloud fits your scale, compliance, and cost goals.',
    cta: 'Talk to Sales',
    accent: '#2dd4bf',
    href: '#',
  },
  {
    icon: '◈',
    title: 'Request a technical deep dive',
    desc: 'Architecture whitepaper, Trust-Tier™ spec, and API reference.',
    cta: 'Read the Docs',
    accent: '#9ca3ff',
    href: '#',
  },
]

const NAV_LINKS = ['About', 'Pricing', 'Developers', 'Careers', 'Contact', 'Privacy']

// Stable star positions — only used in CTA section
const STARS = Array.from({ length: 50 }, (_, i) => ({
  size:    ((i * 13 + 7)  % 16) / 10 + 0.3,
  top:     ((i * 37 + 11) % 100),
  left:    ((i * 73 + 19) % 100),
  opacity: ((i * 17 + 3)  % 18) / 100 + 0.03,
}))

function setSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CTAFooter() {
  const gridRef        = useRef<HTMLDivElement>(null)
  const ctaHeadRef     = useRef<HTMLDivElement>(null)
  const wordmarkRef    = useRef<HTMLDivElement>(null)
  const footerLinksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ctaHeadRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          Array.from(ctaHeadRef.current!.children),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }
        )
      },
    })

    ScrollTrigger.create({
      trigger: gridRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          Array.from(gridRef.current!.children),
          { opacity: 0, y: 32, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: 'expo.out' }
        )
      },
    })

    ScrollTrigger.create({
      trigger: footerLinksRef.current,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          footerLinksRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
        )
        gsap.fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 60, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.6, ease: 'expo.out', delay: 0.1 }
        )
      },
    })
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          CTA SECTION — dark navy, stars, glowing separator at top
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="section-cta"
        className="relative overflow-hidden"
        style={{ background: '#06081a' }}
      >
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: s.size, height: s.size,
                top: `${s.top}%`, left: `${s.left}%`,
                background: '#fff', opacity: s.opacity,
              }}
            />
          ))}
        </div>

        {/* Glowing separator */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden>
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent 0%, rgba(92,156,255,0.55) 30%, rgba(156,163,255,0.55) 70%, transparent 100%)',
          }} />
          <div style={{
            height: '180px',
            background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(92,156,255,0.08) 0%, transparent 70%)',
          }} />
        </div>

        {/* Content */}
        <div className="section-pad pt-36 pb-28 max-w-7xl mx-auto relative z-10">

          {/* Heading */}
          <div ref={ctaHeadRef} className="text-center mb-16">
            <div className="eyebrow mb-5 opacity-0">Get Started</div>
            <h2
              className="font-display text-white mb-5 opacity-0"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
              }}
            >
              You deserve a cloud<br />
              <span style={{
                background: 'linear-gradient(120deg, #5c9cff 0%, #9ca3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                as smart as your data.
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 mt-8 opacity-0">
              <a href="#" className="btn-primary">
                Deploy Now
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#" className="btn-outline">Schedule Demo</a>
            </div>
          </div>

          {/* Cards */}
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ctaCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="navy-card card-spotlight relative overflow-hidden flex flex-col gap-4 p-7 group"
                style={{
                  borderColor: card.accent + '25',
                  minHeight: '200px',
                  transition: 'border-color 0.3s ease, box-shadow 0.35s ease, transform 0.3s ease',
                }}
                onMouseMove={setSpotlight}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = card.accent + '55'
                  e.currentTarget.style.boxShadow = `0 0 40px ${card.accent}18, 0 18px 48px rgba(0,0,0,0.4)`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = card.accent + '25'
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.transform = ''
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to right, transparent, ${card.accent}90, transparent)`,
                    transition: 'opacity 0.4s ease',
                  }}
                />
                <span style={{ fontSize: '1.75rem', position: 'relative', zIndex: 1 }}>{card.icon}</span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative', zIndex: 1 }}>
                  <div className="font-display font-semibold text-white" style={{ fontSize: '0.9375rem', lineHeight: 1.3 }}>
                    {card.title}
                  </div>
                  <p className="font-body" style={{ color: '#7089c0', fontSize: '0.875rem', lineHeight: 1.65 }}>
                    {card.desc}
                  </p>
                </div>
                <div
                  className="font-body font-medium flex items-center gap-1.5"
                  style={{ color: card.accent, fontSize: '0.875rem', position: 'relative', zIndex: 1 }}
                >
                  {card.cta}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M2 6H10M6.5 2L10 6L6.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER — minimal: logo + nav → giant filled-ghost wordmark → copyright
      ═══════════════════════════════════════════════════════════════════ */}
      <footer
        id="section-footer"
        className="relative overflow-hidden"
        style={{ background: '#060c1e' }}
      >
        {/* Deep blue horizon glow — atmospheric depth without a photo */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 110% 55% at 50% 120%, rgba(18,36,130,0.45) 0%, transparent 58%)',
          }}
        />

        {/* Glowing separator line at top */}
        <div
          aria-hidden
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(92,156,255,0.3) 35%, rgba(156,163,255,0.3) 65%, transparent 100%)',
          }}
        />

        {/* Nav row — logo left, links right */}
        <div
          ref={footerLinksRef}
          style={{
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            padding: 'clamp(2.5rem, 4vw, 4rem) clamp(1.5rem, 5vw, 5rem)',
            maxWidth: '80rem',
            margin: '0 auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Logo + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 56 56" fill="none">
                <polygon points="28,4 50,16 50,40 28,52 6,40 6,16" stroke="#5c9cff" strokeWidth="1.5" fill="none" opacity="0.55" />
                <circle cx="28" cy="28" r="4" fill="#5c9cff" />
              </svg>
              <span className="font-display font-semibold text-white" style={{ fontSize: '0.9375rem' }}>NexQloud</span>
            </a>
            <span className="font-mono" style={{ fontSize: '0.625rem', color: '#3a4f72', letterSpacing: '0.1em' }}>
              DECENTRALIZED CLOUD INFRASTRUCTURE
            </span>
          </div>

          {/* Nav links — simple, clean, hover brightens */}
          <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem 2rem' }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="font-body footer-nav-text"
                style={{ fontSize: '0.875rem', textDecoration: 'none' }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Giant filled-ghost wordmark ───────────────────────────────────
            No max-width — fills viewport. Color is a fixed semi-transparent
            white so it's always legible as a ghost (not fading to invisible).
        ──────────────────────────────────────────────────────────────── */}
        <div
          ref={wordmarkRef}
          aria-hidden
          style={{
            opacity: 0,
            overflow: 'hidden',
            padding: '0 clamp(1rem, 2vw, 3rem) clamp(1rem, 2vw, 2.5rem)',
            userSelect: 'none',
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <div
            className="font-display font-black"
            style={{
              fontSize: 'clamp(6.5rem, 21vw, 18rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.045em',
              whiteSpace: 'nowrap',
              /* Filled ghost — always visible, not fading to transparent */
              background: 'linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(92,156,255,0.08) 55%, rgba(255,255,255,0.05) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NexQloud
          </div>
        </div>

        {/* Copyright bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: 'clamp(1.25rem, 2vw, 1.75rem) clamp(1.5rem, 5vw, 5rem)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <p className="font-mono" style={{ color: '#3a4f72', fontSize: '0.625rem', letterSpacing: '0.06em' }}>
            © 2025 NEXQLOUD TECHNOLOGIES, INC. · ALL RIGHTS RESERVED.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              className="animate-pulse rounded-full"
              style={{ width: '5px', height: '5px', background: '#22d39b' }}
            />
            <span className="font-mono" style={{ fontSize: '0.5625rem', color: '#22d39b', letterSpacing: '0.08em' }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
