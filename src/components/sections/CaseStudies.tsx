import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { caseStudies, trustTiers } from '../../data'

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const rafId = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onDown = (e: PointerEvent) => {
      isDragging.current = true
      startX.current = e.clientX - track.scrollLeft
      scrollLeft.current = track.scrollLeft
      lastX.current = e.clientX
      velocity.current = 0
      track.style.cursor = 'grabbing'
      cancelAnimationFrame(rafId.current)
    }

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      velocity.current = e.clientX - lastX.current
      lastX.current = e.clientX
      track.scrollLeft = startX.current - e.clientX
    }

    const onUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      track.style.cursor = 'grab'
      const decelerate = () => {
        if (Math.abs(velocity.current) < 0.5) return
        track.scrollLeft -= velocity.current
        velocity.current *= 0.92
        rafId.current = requestAnimationFrame(decelerate)
      }
      decelerate()
    }

    track.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          track.children,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'expo.out' }
        )
      },
    })

    return () => {
      track.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <section
      id="section-cases"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
      style={{
        background: 'rgba(8,13,44,0.68)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto mb-12 section-pad">
        <div className="eyebrow mb-5">Customer Results</div>
        <div className="flex items-end justify-between gap-4">
          <h2
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Real savings.<br />
            <span style={{ color: '#3d5181' }}>Real companies.</span>
          </h2>
          <span className="eyebrow hidden md:block" style={{ color: '#3d5181', flexShrink: 0 }}>
            ← Drag to explore →
          </span>
        </div>
      </div>

      {/* Draggable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scrollbar-none select-none"
        style={{
          paddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          paddingRight: '4rem',
          cursor: 'grab',
        }}
      >
        {caseStudies.map((cs, i) => {
          const tier = trustTiers.find((t) => t.id === cs.tier[0])
          return (
            <div
              key={i}
              className="flex-shrink-0 navy-card card-hover p-7 flex flex-col justify-between relative"
              style={{
                width: 'min(80vw, 360px)',
                minHeight: '280px',
                borderColor: tier ? tier.color + '18' : 'rgba(80,93,170,0.16)',
                background: tier
                  ? `linear-gradient(135deg, ${tier.color}04, rgba(9,14,45,0.92))`
                  : undefined,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-sm font-bold"
                  style={{
                    background: tier ? tier.color + '15' : 'rgba(255,255,255,0.05)',
                    color: tier?.color ?? '#ffffff',
                    border: `1px solid ${tier ? tier.color + '25' : 'rgba(80,93,170,0.15)'}`,
                  }}
                >
                  {cs.logo}
                </div>
                <div className={`tier-badge tier-${cs.tier[0].toLowerCase()}`}>
                  Tier {cs.tier}
                </div>
              </div>

              {/* Quote */}
              <blockquote
                className="font-body flex-1 mb-5"
                style={{ color: '#7089c0', fontSize: '0.9375rem', lineHeight: 1.65 }}
              >
                "{cs.quote}"
              </blockquote>

              {/* Metrics + attribution */}
              <div className="flex items-end justify-between">
                <div>
                  <div
                    className="font-display font-bold"
                    style={{ fontSize: '1.375rem', color: tier?.color ?? '#5c9cff', letterSpacing: '-0.02em' }}
                  >
                    {cs.result}
                  </div>
                  <div className="eyebrow mt-0.5" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>{cs.metric}</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-semibold text-white" style={{ fontSize: '0.875rem' }}>{cs.company}</div>
                  <div className="eyebrow mt-0.5" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>{cs.industry}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
