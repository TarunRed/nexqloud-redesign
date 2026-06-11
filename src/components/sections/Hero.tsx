import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { siteConfig, networkStats } from '../../data'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLDivElement>(null)
  const dragHintRef = useRef<HTMLDivElement>(null)

  const reduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  useEffect(() => {
    const delay = 2.2
    const tl = gsap.timeline({ delay })

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: reduced ? 0 : 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
      0
    )

    if (headlineRef.current && !reduced) {
      const words = headlineRef.current.querySelectorAll('.hw > span')
      tl.fromTo(
        words,
        { y: '108%' },
        { y: '0%', duration: 0.88, stagger: 0.055, ease: 'expo.out' },
        0.15
      )
    } else if (headlineRef.current) {
      tl.fromTo(headlineRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.15)
    }

    tl.fromTo(
      subRef.current,
      { opacity: 0, y: reduced ? 0 : 18 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' },
      0.42
    )

    tl.fromTo(
      descRef.current,
      { opacity: 0, y: reduced ? 0 : 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
      0.50
    )

    if (ctasRef.current) {
      tl.fromTo(
        Array.from(ctasRef.current.children),
        { opacity: 0, y: reduced ? 0 : 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: 'expo.out' },
        0.58
      )
    }

    if (statsRef.current) {
      tl.fromTo(
        Array.from(statsRef.current.children),
        { opacity: 0, y: reduced ? 0 : 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'expo.out' },
        0.74
      )
    }

    tl.fromTo(hintRef.current, { opacity: 0 }, { opacity: 0.5, duration: 0.6 }, 1.0)
    tl.fromTo(
      [legendRef.current, dragHintRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.1 },
      1.1
    )
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress
        gsap.set(content, { y: p * -70, opacity: 1 - p * 1.5 })
      },
    })
  }, [reduced])

  const words = siteConfig.tagline.split(' ')

  return (
    <section
      id="section-hero"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '100svh', background: 'transparent' }}
    >
      {/* Radial vignette — keeps text legible without hiding globe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 75% at 50% 46%, transparent 18%, rgba(8,13,44,0.30) 55%, rgba(8,13,44,0.82) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '26%',
          background: 'linear-gradient(to bottom, transparent, rgba(8,13,44,0.95))',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          minHeight: '100svh',
          paddingBottom: '6.5rem',
          paddingTop: '7rem',
          pointerEvents: 'none',
        }}
      >
        {/* Eyebrow pill */}
        <div
          ref={eyebrowRef}
          style={{ opacity: 0, pointerEvents: 'auto', marginBottom: '1.5rem' }}
        >
          <div
            className="eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(92,156,255,0.06)',
              border: '1px solid rgba(92,156,255,0.18)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#5c9cff', animation: 'pulseGlow 2.4s ease-in-out infinite' }}
            />
            Trust-Tier™ Routing · Live Global Network · NXQ Token
          </div>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          aria-label={siteConfig.tagline}
          className="font-display text-white text-center"
          style={{
            fontSize: 'clamp(2.8rem, 7.5vw, 7rem)',
            fontWeight: 300,
            lineHeight: 0.94,
            letterSpacing: '-0.02em',
            maxWidth: '14ch',
            pointerEvents: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className="hw"
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                marginRight: '0.22em',
                verticalAlign: 'bottom',
              }}
            >
              <span style={{ display: 'inline-block' }}>{word}</span>
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className="font-body text-center leading-relaxed"
          style={{
            opacity: 0,
            color: '#7089c0',
            maxWidth: '46ch',
            fontSize: 'clamp(1rem, 1.6vw, 1.125rem)',
            pointerEvents: 'auto',
            marginBottom: '0.75rem',
          }}
        >
          {siteConfig.sub}
        </p>
        <p
          ref={descRef}
          style={{
            opacity: 0,
            color: '#6878a8',
            maxWidth: '42ch',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            textAlign: 'center',
            pointerEvents: 'auto',
            marginBottom: '2.25rem',
          }}
        >
          {siteConfig.description}
        </p>

        {/* CTAs */}
        <div
          ref={ctasRef}
          className="flex flex-col sm:flex-row items-center gap-3"
          style={{ pointerEvents: 'auto', marginBottom: '3rem' }}
        >
          <a href="#" className="btn-primary">
            Deploy Now
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#" className="btn-outline">Schedule Demo</a>
          <a
            href="#"
            className="btn-outline"
            style={{ borderColor: 'rgba(34,211,155,0.35)', color: '#22d39b' }}
          >
            Run a Node →
          </a>
        </div>

        {/* Live network stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          style={{ maxWidth: '44rem', width: '100%', pointerEvents: 'auto' }}
        >
          {networkStats.map((stat) => (
            <div
              key={stat.label}
              className="navy-card text-center px-4 py-3.5"
            >
              <div
                className="font-display font-semibold text-white"
                style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}
              >
                {stat.prefix}
                {typeof stat.value === 'number' && stat.value > 1000
                  ? `${(stat.value / 1000).toFixed(0)}K`
                  : stat.value}
                {stat.suffix}
              </div>
              <div
                className="eyebrow mt-1"
                style={{ fontSize: '0.6rem', color: '#6878a8' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={hintRef}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 11,
          opacity: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        <span className="eyebrow" style={{ fontSize: '0.6rem', color: '#6878a8' }}>Scroll</span>
        <div
          style={{
            width: '1px',
            height: '2rem',
            background: 'linear-gradient(to bottom, #6878a8, transparent)',
            animation: 'float 2.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Tier legend — bottom right */}
      <div
        ref={legendRef}
        className="hidden md:flex"
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2.5rem',
          zIndex: 11,
          flexDirection: 'column',
          gap: '0.4rem',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {[
          { tier: 'A', label: 'Regulated', color: '#22d39b' },
          { tier: 'B', label: 'Enterprise', color: '#2dd4bf' },
          { tier: 'C', label: 'Edge', color: '#5c9cff' },
          { tier: 'D', label: 'Public', color: '#9ca3ff' },
        ].map((t) => (
          <div key={t.tier} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
            <span
              className="eyebrow"
              style={{ color: t.color, fontSize: '0.6rem' }}
            >
              {t.tier} · {t.label}
            </span>
          </div>
        ))}
      </div>

      {/* Drag hint — bottom left */}
      <div
        ref={dragHintRef}
        className="hidden md:flex items-center gap-2"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2.5rem',
          zIndex: 11,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '0.875rem', filter: 'grayscale(1)', opacity: 0.4 }}>✋</span>
        <span className="eyebrow" style={{ fontSize: '0.6rem', color: '#6878a8' }}>Drag globe to rotate</span>
      </div>
    </section>
  )
}
