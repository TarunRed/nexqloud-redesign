import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { sustainabilityStats } from '../../data'

function RadialGauge({ value, label, index }: { value: number; label: string; index: number }) {
  const circleRef = useRef<SVGCircleElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const radius = 54
  const circ = 2 * Math.PI * radius

  useEffect(() => {
    const el = circleRef.current
    if (!el || !numRef.current) return

    gsap.set(el, { strokeDasharray: circ, strokeDashoffset: circ })

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const dur = reduced ? 0.3 : 1.4

        gsap.to(el, {
          strokeDashoffset: circ - (value / 100) * circ,
          duration: dur,
          delay: index * 0.15,
          ease: 'power2.out',
        })

        const proxy = { v: 0 }
        gsap.fromTo(proxy, { v: 0 }, {
          v: value,
          duration: dur,
          delay: index * 0.15,
          ease: 'power2.out',
          onUpdate() {
            if (numRef.current) numRef.current.textContent = Math.round(proxy.v) + '%'
          },
        })
      },
    })
  }, [value, circ, index])

  const colors = ['#5c9cff', '#2dd4bf', '#22d39b']
  const color = colors[index] ?? '#5c9cff'

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: '9rem', height: '9rem' }}>
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(80,93,170,0.15)" strokeWidth="7" />
          <circle
            ref={circleRef}
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            ref={numRef}
            className="font-display font-bold"
            style={{ fontSize: '1.5rem', color, letterSpacing: '-0.03em' }}
          >
            0%
          </span>
        </div>
      </div>
      <p
        className="font-body text-center"
        style={{ color: '#7089c0', fontSize: '0.875rem', maxWidth: '130px', lineHeight: 1.5 }}
      >
        {label}
      </p>
    </div>
  )
}

export function Sustainability() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (headingRef.current) {
          gsap.fromTo(
            Array.from(headingRef.current.children),
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }
          )
        }
      },
    })
  }, [])

  return (
    <section
      id="section-sustainability"
      ref={sectionRef}
      className="py-32 section-pad relative overflow-hidden"
      style={{
        background: 'rgba(8,13,44,0.68)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      {/* Subtle green glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 85%, rgba(34,211,155,0.05) 0%, transparent 65%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-20">
          <div className="eyebrow mb-5 opacity-0" style={{ color: '#22d39b' }}>
            Sustainability
          </div>
          <h2
            className="font-display text-white opacity-0"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            88% less energy.<br />
            <span style={{ color: '#3d5181' }}>Zero performance loss.</span>
          </h2>
          <p
            className="font-body mt-5 mx-auto opacity-0"
            style={{ color: '#7089c0', fontSize: '1.0625rem', maxWidth: '52ch' }}
          >
            Tier C NanoServers™ eliminate 40% cooling waste and cut CPU energy by 80%, delivering
            identical compute with 88% less total energy.
          </p>
        </div>

        {/* Radial gauges */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-24">
          {sustainabilityStats.map((stat, i) => (
            <RadialGauge key={i} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>

        {/* NanoServer callout */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow mb-5" style={{ color: '#22d39b' }}>NanoServer™</div>
            <h3
              className="font-display font-semibold text-white mb-5"
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              Your idle hardware becomes<br />productive green infrastructure.
            </h3>
            <p
              className="font-body mb-8"
              style={{ color: '#7089c0', fontSize: '1.0625rem', lineHeight: 1.7 }}
            >
              A NanoServer is a certified edge node — a consumer or prosumer device that contributes
              CPU, GPU, and memory to the NexQloud network. We verify its power source, performance,
              and uptime. You earn NXQ for every compute-hour.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="btn-outline"
                style={{ borderColor: 'rgba(34,211,155,0.35)', color: '#22d39b', fontSize: '0.875rem' }}
              >
                Become a Node Partner
              </a>
              <a href="#" className="btn-outline" style={{ fontSize: '0.875rem' }}>ESG Report →</a>
            </div>
          </div>

          {/* Device visual */}
          <div className="flex justify-center">
            <div className="relative">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: '4px',
                    height: '4px',
                    background: '#22d39b',
                    opacity: 0.5,
                    top: `${20 + Math.sin(i * 1.1) * 38}%`,
                    left: `${12 + Math.cos(i * 1.3) * 38}%`,
                    animation: `float ${3 + i * 0.6}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}

              <div
                className="navy-card flex flex-col items-center justify-center gap-4 text-center"
                style={{
                  width: '14rem',
                  height: '10rem',
                  borderColor: 'rgba(34,211,155,0.2)',
                  background: 'linear-gradient(135deg, rgba(34,211,155,0.06), rgba(9,14,45,0.9))',
                  boxShadow: '0 0 50px rgba(34,211,155,0.10)',
                }}
              >
                <div style={{ fontSize: '2.25rem' }}>⬡</div>
                <div>
                  <div
                    className="font-display font-semibold"
                    style={{ fontSize: '0.875rem', color: '#22d39b' }}
                  >
                    NanoServer Node
                  </div>
                  <div
                    className="eyebrow mt-0.5"
                    style={{ color: '#3d5181', fontSize: '0.5625rem' }}
                  >
                    Online · Tier C
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d39b' }} />
                  <span
                    className="font-mono"
                    style={{ fontSize: '0.6875rem', color: '#22d39b' }}
                  >
                    +0.4 NXQ / hr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
