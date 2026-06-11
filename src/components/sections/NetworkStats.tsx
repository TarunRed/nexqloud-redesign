import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { networkStats, trustTiers } from '../../data'

function Odometer({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = numRef.current
    if (!el) return

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isDecimal = value < 100
        const dur = reduced ? 0.3 : 2

        const proxy = { v: 0 }
        gsap.fromTo(proxy, { v: 0 }, {
          v: value,
          duration: dur,
          delay: index * 0.12,
          ease: 'power3.out',
          onUpdate() {
            if (!el) return
            if (isDecimal) {
              el.textContent = proxy.v.toFixed(1)
            } else if (proxy.v >= 1000) {
              el.textContent = (proxy.v / 1000).toFixed(0) + 'K'
            } else {
              el.textContent = Math.round(proxy.v).toLocaleString()
            }
          },
          onComplete() {
            if (isDecimal) el.textContent = value.toFixed(1)
            else if (value >= 1000) el.textContent = (value / 1000).toFixed(0) + 'K'
            else el.textContent = value.toLocaleString()
          },
        })
      },
    })
  }, [value, index])

  return (
    <div className="text-center flex flex-col items-center gap-3">
      <div className="font-display text-white" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em' }}>
        <span ref={numRef}>0</span>
        <span style={{ color: '#5c9cff' }}>{suffix}</span>
      </div>
      <div className="eyebrow" style={{ color: '#6878a8', fontSize: '0.625rem' }}>{label}</div>
    </div>
  )
}

export function NetworkStats() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="section-network"
      ref={sectionRef}
      className="py-32 section-pad relative overflow-hidden"
      style={{
        background: 'rgba(8,13,44,0.65)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      {/* Blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(92,156,255,0.05) 0%, transparent 65%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="eyebrow mb-5">Live Network</div>
          <h2
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            The network is <span style={{ color: '#5c9cff' }}>alive</span>.
          </h2>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22d39b' }} />
            <span className="eyebrow" style={{ color: '#22d39b', fontSize: '0.625rem' }}>Live data</span>
          </div>
        </div>

        {/* Odometers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-20">
          {networkStats.map((stat, i) => (
            <Odometer
              key={stat.label}
              value={stat.value as number}
              suffix={stat.suffix}
              label={stat.label}
              index={i}
            />
          ))}
        </div>

        {/* Tier availability */}
        <div className="flex flex-wrap justify-center gap-3">
          {trustTiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center gap-3 navy-card px-5 py-3"
              style={{ borderColor: tier.color + '20' }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: tier.color }} />
                <span className="font-mono font-medium" style={{ fontSize: '0.75rem', color: tier.color }}>
                  Tier {tier.id}
                </span>
              </div>
              <div className="w-px h-4" style={{ background: tier.color + '25' }} />
              <span className="font-mono" style={{ fontSize: '0.6875rem', color: tier.id === 'A' || tier.id === 'B' ? '#6878a8' : '#22d39b' }}>
                {tier.id === 'A' || tier.id === 'B' ? 'Coming Soon' : 'Live'}
              </span>
              <span className="font-display font-semibold text-white" style={{ fontSize: '0.875rem' }}>
                {tier.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
