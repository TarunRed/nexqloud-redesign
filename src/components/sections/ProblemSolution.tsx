import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { problems, solutions } from '../../data'

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null)
  const problemsRef = useRef<HTMLDivElement>(null)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = sectionRef.current
    if (!section) return

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        if (!reduced) {
          if (problemsRef.current?.children) {
            gsap.fromTo(
              Array.from(problemsRef.current.children),
              { opacity: 0, x: -24 },
              { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'expo.out' }
            )
          }
          if (solutionsRef.current?.children) {
            gsap.fromTo(
              Array.from(solutionsRef.current.children),
              { opacity: 0, x: 24 },
              { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'expo.out', delay: 0.15 }
            )
          }
        }
        if (numberRef.current) {
          const proxy = { val: 0 }
          gsap.fromTo(proxy, { val: 0 }, {
            val: 50,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.3,
            onUpdate() {
              if (numberRef.current) numberRef.current.textContent = Math.round(proxy.val) + '%'
            },
          })
        }
        gsap.fromTo(headingRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
      },
    })
  }, [])

  return (
    <section
      id="section-problem"
      ref={sectionRef}
      className="py-32 section-pad"
      style={{
        background: 'rgba(8,13,44,0.68)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="eyebrow mb-5">The Problem</div>
          <h2
            ref={headingRef}
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              opacity: 0,
            }}
          >
            Legacy clouds waste<br />
            <span style={{ color: '#3d5181' }}>your resources.</span>
          </h2>
        </div>

        {/* Hero stat */}
        <div className="text-center mb-16">
          <div
            className="inline-flex flex-col items-center gap-3 navy-card px-12 py-8"
            style={{ borderColor: 'rgba(92,156,255,0.12)' }}
          >
            <span
              ref={numberRef}
              className="font-display text-white"
              style={{
                fontSize: 'clamp(4rem, 8vw, 6rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: '#5c9cff',
              }}
            >
              0%
            </span>
            <span
              className="font-body"
              style={{ color: '#7089c0', fontSize: '0.9375rem' }}
            >
              average savings with NexQloud Trust-Tier™ routing
            </span>
          </div>
        </div>

        {/* Two-column comparison */}
        <div className="grid md:grid-cols-2 gap-5 lg:gap-10">

          {/* Problems column */}
          <div>
            <div
              className="eyebrow mb-6"
              style={{ color: '#db4d4d', fontSize: '0.6875rem' }}
            >
              Legacy Cloud
            </div>
            <div ref={problemsRef} className="flex flex-col gap-4">
              {problems.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 navy-card card-hover relative p-5"
                  style={{
                    borderColor: 'rgba(219,77,77,0.12)',
                    background: 'rgba(219,77,77,0.03)',
                    opacity: 0,
                  }}
                >
                  <span style={{ fontSize: '1.25rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>
                    {p.icon}
                  </span>
                  <div>
                    <div
                      className="font-display font-semibold text-white mb-1"
                      style={{ fontSize: '0.9375rem' }}
                    >
                      {p.title}
                    </div>
                    <p className="font-body" style={{ color: '#7089c0', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions column */}
          <div>
            <div
              className="eyebrow mb-6"
              style={{ color: '#22d39b', fontSize: '0.6875rem' }}
            >
              NexQloud
            </div>
            <div ref={solutionsRef} className="flex flex-col gap-4">
              {solutions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 navy-card card-hover relative p-5"
                  style={{
                    borderColor: 'rgba(34,211,155,0.14)',
                    background: 'rgba(34,211,155,0.03)',
                    opacity: 0,
                  }}
                >
                  <span style={{ fontSize: '1.25rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>
                    {s.icon}
                  </span>
                  <div>
                    <div
                      className="font-display font-semibold text-white mb-1"
                      style={{ fontSize: '0.9375rem' }}
                    >
                      {s.title}
                    </div>
                    <p className="font-body" style={{ color: '#ccd5e5', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
