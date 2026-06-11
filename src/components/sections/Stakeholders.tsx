import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { stakeholders } from '../../data'

const PER = 100 / stakeholders.length // 25 for 4 slides

export function Stakeholders() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const pointerStart = useRef(0)
  const isDragging = useRef(false)

  const goTo = useCallback((nextIdx: number) => {
    const next = Math.max(0, Math.min(stakeholders.length - 1, nextIdx))
    if (next === activeRef.current) return
    activeRef.current = next
    setActive(next)
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        xPercent: -(next * PER),
        duration: 0.7,
        ease: 'expo.inOut',
      })
    }
  }, [])

  // Drag / swipe
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onDown = (e: PointerEvent) => {
      isDragging.current = true
      pointerStart.current = e.clientX
      track.setPointerCapture(e.pointerId)
      track.style.cursor = 'grabbing'
    }

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const delta = e.clientX - pointerStart.current
      const base = -(activeRef.current * PER)
      gsap.set(track, { xPercent: base + (delta / window.innerWidth) * PER })
    }

    const onUp = (e: PointerEvent) => {
      if (!isDragging.current) return
      isDragging.current = false
      track.style.cursor = 'grab'
      const delta = e.clientX - pointerStart.current
      if (Math.abs(delta) > 55) {
        goTo(activeRef.current + (delta < 0 ? 1 : -1))
      } else {
        // Snap back: goTo bails early when index is unchanged, so force snap manually
        gsap.to(track, { xPercent: -(activeRef.current * PER), duration: 0.5, ease: 'expo.out' })
      }
    }

    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup', onUp)
    track.addEventListener('pointercancel', onUp)
    return () => {
      track.removeEventListener('pointerdown', onDown)
      track.removeEventListener('pointermove', onMove)
      track.removeEventListener('pointerup', onUp)
      track.removeEventListener('pointercancel', onUp)
    }
  }, [goTo])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      if (rect.top > window.innerHeight || rect.bottom < 0) return
      if (e.key === 'ArrowLeft') goTo(activeRef.current - 1)
      if (e.key === 'ArrowRight') goTo(activeRef.current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo])

  const sl = stakeholders[active]

  return (
    <section
      id="section-stakeholders"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'rgba(8,13,44,0.48)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
        borderBottom: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      {/* Section header */}
      <div className="pt-24 pb-10 text-center section-pad">
        <div className="eyebrow mb-5">For Every Stakeholder</div>
        <h2
          className="font-display text-white"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.75rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          NexQloud works smarter<br />
          <span style={{ color: '#6878a8' }}>for your entire team.</span>
        </h2>
      </div>

      {/* Slider overflow container */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex"
          style={{
            width: `calc(${stakeholders.length} * 100vw)`,
            cursor: 'grab',
            touchAction: 'pan-y',
            userSelect: 'none',
          }}
        >
          {stakeholders.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-center"
              style={{
                width: '100vw',
                minWidth: '100vw',
                padding: '0 clamp(1.5rem, 5vw, 5rem)',
                paddingBottom: '2rem',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '1100px',
                  background: 'rgba(29,34,66,0.92)',
                  border: `1px solid ${s.color}18`,
                  borderRadius: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                  gap: 'clamp(2rem, 5vw, 4rem)',
                  alignItems: 'center',
                  padding: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                {/* Left — content */}
                <div>
                  <div
                    className="eyebrow mb-5"
                    style={{ color: s.color, fontSize: '0.75rem' }}
                  >
                    {s.label}
                  </div>
                  <h3
                    className="font-display font-semibold text-white mb-5"
                    style={{
                      fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.headline}
                  </h3>
                  <p
                    className="font-body mb-8"
                    style={{
                      color: '#7089c0',
                      fontSize: '1.0625rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {s.body}
                  </p>
                  <a
                    href="#"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.625rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${s.color}40`,
                      color: s.color,
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      background: `${s.color}08`,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = s.color + '15'
                      e.currentTarget.style.borderColor = s.color + '70'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = s.color + '08'
                      e.currentTarget.style.borderColor = s.color + '40'
                    }}
                  >
                    {s.cta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M7.5 3.5L11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>

                {/* Right — icon + stats */}
                <div className="flex flex-col gap-6">
                  {/* Large decorative icon */}
                  <div
                    className="font-display select-none"
                    aria-hidden
                    style={{
                      fontSize: 'clamp(4.5rem, 8vw, 7.5rem)',
                      lineHeight: 1,
                      color: s.color,
                      opacity: 0.12,
                      letterSpacing: '-0.05em',
                      userSelect: 'none',
                    }}
                  >
                    {s.icon}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {s.stats.map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          background: 'rgba(9,14,45,0.85)',
                          border: '1px solid rgba(80,93,170,0.16)',
                          borderRadius: '0.875rem',
                          padding: '0.875rem 0.625rem',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          className="font-display font-bold"
                          style={{
                            fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)',
                            color: s.color,
                            marginBottom: '0.35rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: '0.5625rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#6878a8',
                            lineHeight: 1.4,
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div
        className="flex items-center justify-center gap-4 pb-16 pt-6"
      >
        {/* Prev */}
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous"
          style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '50%',
            border: '1px solid rgba(80,93,170,0.25)',
            background: 'rgba(29,34,66,0.6)',
            color: active === 0 ? '#6878a8' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          ←
        </button>

        {/* Label tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {stakeholders.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              style={{
                padding: '0.3rem 0.875rem',
                borderRadius: '9999px',
                border: `1px solid ${i === active ? sl.color + '55' : 'rgba(80,93,170,0.18)'}`,
                background: i === active ? sl.color + '12' : 'transparent',
                color: i === active ? sl.color : '#6878a8',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.25s',
                whiteSpace: 'nowrap',
              }}
              aria-label={s.label}
              aria-pressed={i === active}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => goTo(active + 1)}
          disabled={active === stakeholders.length - 1}
          aria-label="Next"
          style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '50%',
            border: '1px solid rgba(80,93,170,0.25)',
            background: 'rgba(29,34,66,0.6)',
            color: active === stakeholders.length - 1 ? '#6878a8' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          →
        </button>
      </div>
    </section>
  )
}
