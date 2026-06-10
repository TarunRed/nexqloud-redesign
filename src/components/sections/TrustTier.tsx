import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { trustTiers } from '../../data'

export function TrustTier() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const meterFillRef = useRef<HTMLDivElement>(null)
  const meterLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = sectionRef.current
    const panels = panelsRef.current
    if (!section || !panels) return
    if (reduced) return

    // On mobile fall through to the static layout
    if (window.innerWidth < 768) return

    const calcTotal = () => {
      // scrollWidth is the full width of all panels + padding + gaps.
      // clientWidth equals scrollWidth because the element has no clipping.
      // We need: how far left to translate so the last panel is fully visible.
      // That is scrollWidth minus the viewport width.
      return Math.max(0, panels.scrollWidth - window.innerWidth)
    }

    let st: ScrollTrigger | null = null

    const buildST = () => {
      if (st) st.kill()

      const totalWidth = calcTotal()

      st = ScrollTrigger.create({
        trigger: section,
        pin: true,
        anticipatePin: 1,
        start: 'top top',
        end: () => `+=${totalWidth + window.innerHeight * 0.8}`,
        scrub: 1.0,
        onUpdate: (self) => {
          gsap.set(panels, { x: -self.progress * totalWidth })

          const tierIndex = Math.min(3, Math.floor(self.progress * 4.0))
          const tier = trustTiers[tierIndex]

          if (meterFillRef.current) {
            gsap.to(meterFillRef.current, {
              height: `${(tierIndex + 1) * 25}%`,
              backgroundColor: tier.color,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
          if (meterLabelRef.current) {
            meterLabelRef.current.textContent = tier.id
            meterLabelRef.current.style.color = tier.color
          }

          gsap.to(section, {
            backgroundColor: tier.color + '06',
            duration: 0.5,
            ease: 'power2.out',
          })
        },
      })
    }

    // Build immediately, then rebuild on resize so totalWidth stays accurate
    buildST()

    const onResize = () => {
      if (st) { st.kill(); st = null }
      buildST()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (st) st.kill()
    }
  }, [])

  return (
    <section
      id="section-trust"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'rgba(8,13,44,0.68)',
        minHeight: '100vh',
        borderTop: '1px solid rgba(80,93,170,0.12)',
        // Explicit z-index so the section stays on top when GSAP makes it position:fixed
        zIndex: 2,
      }}
    >
      {/* Pinned heading */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pt-20 pb-10 section-pad pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(8,13,44,0.92) 60%, transparent)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow mb-4">Trust-Tier™ System</div>
          <h2
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            Route by trust. Save by design.
          </h2>
          <p
            className="font-body mt-3"
            style={{ color: '#7089c0', fontSize: '1rem', maxWidth: '52ch' }}
          >
            Every workload lands exactly where its security requirements demand — automatically.
          </p>
        </div>
      </div>

      {/* Trust meter */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
        <span
          className="eyebrow"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#3d5181', fontSize: '0.5625rem' }}
        >
          Trust Level
        </span>
        <div className="w-1.5 h-28 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            ref={meterFillRef}
            className="w-full rounded-full"
            style={{ height: '25%', background: '#22d39b', marginTop: 'auto', position: 'relative' }}
          />
        </div>
        <span ref={meterLabelRef} className="font-display font-bold" style={{ fontSize: '0.875rem', color: '#22d39b' }}>
          A
        </span>
      </div>

      {/* Horizontal panel track */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ paddingTop: '14rem', overflow: 'hidden' }}
      >
        <div
          ref={panelsRef}
          className="flex will-change-transform"
          style={{ paddingLeft: '10vw', gap: '4vw', paddingRight: '10vw' }}
        >
          {trustTiers.map((tier) => (
            <div
              key={tier.id}
              className="flex-shrink-0 flex flex-col justify-between navy-card p-8 md:p-12"
              style={{
                width: 'min(80vw, 520px)',
                minHeight: '420px',
                borderColor: tier.color + '20',
                background: `linear-gradient(135deg, ${tier.color}05 0%, rgba(9,14,45,0.95) 100%)`,
              }}
            >
              {/* Tier header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="eyebrow mb-2" style={{ color: tier.color, fontSize: '0.625rem' }}>
                    Tier {tier.id}
                  </div>
                  <div
                    className="font-display font-bold text-white leading-none"
                    style={{ fontSize: '4rem', letterSpacing: '-0.04em' }}
                  >
                    {tier.id}
                  </div>
                  <div className="font-display font-semibold text-white mt-1" style={{ fontSize: '1.125rem' }}>
                    {tier.label}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-display font-bold"
                    style={{ fontSize: '2.5rem', color: tier.color, letterSpacing: '-0.03em' }}
                  >
                    {tier.savings}
                  </div>
                  <div className="eyebrow" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>avg savings</div>
                </div>
              </div>

              <p className="font-body mb-6" style={{ color: '#7089c0', fontSize: '0.9375rem', lineHeight: 1.65 }}>
                {tier.description}
              </p>

              {/* Workloads */}
              <div className="mb-6">
                <div className="eyebrow mb-3" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>Workloads</div>
                <div className="flex flex-wrap gap-2">
                  {tier.workloads.map((w) => (
                    <span
                      key={w}
                      className="font-mono"
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: tier.color + '10',
                        color: tier.color,
                        border: `1px solid ${tier.color}25`,
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div className="mb-6">
                <div className="eyebrow mb-3" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>Compliance</div>
                <div className="flex flex-wrap gap-2">
                  {tier.compliance.map((c) => (
                    <span
                      key={c}
                      className="font-mono"
                      style={{
                        fontSize: '0.6875rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.375rem',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#7089c0',
                        border: '1px solid rgba(80,93,170,0.18)',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5" style={{ borderTop: `1px solid ${tier.color}15` }}>
                <p className="font-display italic" style={{ color: tier.color, fontSize: '0.9375rem' }}>
                  "{tier.tagline}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint — desktop only */}
      <div
        className="absolute bottom-8 left-1/2 hidden md:flex items-center gap-2"
        style={{ transform: 'translateX(-50%)', zIndex: 20 }}
      >
        <div className="eyebrow" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>Scroll to explore tiers</div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7H12M7.5 3L12 7L7.5 11" stroke="#3d5181" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Mobile fallback — static stacked cards */}
      <div className="md:hidden block pt-48 pb-20 section-pad">
        {trustTiers.map((tier) => (
          <div
            key={tier.id}
            className="mb-5 navy-card p-6"
            style={{
              borderColor: tier.color + '20',
              background: `linear-gradient(135deg, ${tier.color}05 0%, rgba(9,14,45,0.95) 100%)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span
                  className="font-display font-bold"
                  style={{ fontSize: '2rem', color: tier.color, letterSpacing: '-0.04em' }}
                >
                  {tier.id}
                </span>
                <span className="font-display font-semibold text-white ml-3" style={{ fontSize: '1rem' }}>
                  {tier.label}
                </span>
              </div>
              <span className="font-display font-bold" style={{ fontSize: '1.25rem', color: tier.color }}>
                {tier.savings}
              </span>
            </div>
            <p className="font-body" style={{ color: '#7089c0', fontSize: '0.9375rem' }}>{tier.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
