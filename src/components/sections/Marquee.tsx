import { useEffect, useRef } from 'react'
import { pressLogos } from '../../data'

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const speed = useRef(1)
  const offset = useRef(0)
  const rafId = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const totalWidth = track.scrollWidth / 2

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY.current
      speed.current = Math.min(3, Math.abs(delta) * 0.2 + 1)
      lastScrollY.current = window.scrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    const tick = () => {
      offset.current = (offset.current + speed.current * 0.5) % totalWidth
      speed.current += (1 - speed.current) * 0.04
      if (track) track.style.transform = `translateX(-${offset.current}px)`
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  const logos = [...pressLogos, ...pressLogos]

  return (
    <section
      className="py-12 overflow-hidden"
      style={{
        borderTop: '1px solid rgba(80,93,170,0.12)',
        borderBottom: '1px solid rgba(80,93,170,0.12)',
        background: 'rgba(8,13,44,0.55)',
      }}
    >
      <p className="eyebrow text-center mb-8" style={{ color: '#3d5181', fontSize: '0.625rem' }}>
        As featured in
      </p>
      <div className="relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(8,13,44,0.95), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(8,13,44,0.95), transparent)' }}
        />
        <div ref={trackRef} className="flex items-center gap-16 will-change-transform" style={{ width: 'max-content' }}>
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center select-none transition-opacity duration-300"
              style={{ minWidth: logo.width, opacity: 0.22 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.55')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.22')}
            >
              <span
                className="font-display font-medium text-white tracking-tight whitespace-nowrap"
                style={{ fontSize: logo.width > 120 ? '0.9375rem' : '1.0625rem' }}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
