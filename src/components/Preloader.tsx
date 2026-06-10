import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      onComplete()
      return
    }

    const tl = gsap.timeline()

    // Count animation
    tl.to({ val: 0 }, {
      val: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate() {
        setCount(Math.round(this.targets()[0].val))
      },
    })

    // Logo assemble
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' },
      '-=1.2'
    )

    // Curtain wipe out
    tl.to(curtainRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'expo.inOut',
      delay: 0.2,
    })

    tl.to(rootRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        onComplete()
        if (rootRef.current) rootRef.current.style.display = 'none'
      },
    })
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99997] flex items-center justify-center"
      style={{ background: '#070A1A' }}
    >
      <div
        ref={curtainRef}
        className="absolute inset-0"
        style={{
          background: '#070A1A',
          clipPath: 'inset(0 0 0% 0)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div ref={logoRef} className="flex flex-col items-center gap-3">
          {/* Logo mark — hexagonal NexQloud icon */}
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <polygon
              points="28,4 50,16 50,40 28,52 6,40 6,16"
              stroke="#5C9CFF"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
            <polygon
              points="28,10 44,19 44,37 28,46 12,37 12,19"
              stroke="#7B61FF"
              strokeWidth="1"
              fill="rgba(92,156,255,0.08)"
            />
            <circle cx="28" cy="28" r="5" fill="#5C9CFF" opacity="0.9" />
            <line x1="28" y1="10" x2="28" y2="18" stroke="#5C9CFF" strokeWidth="1" opacity="0.5" />
            <line x1="28" y1="38" x2="28" y2="46" stroke="#5C9CFF" strokeWidth="1" opacity="0.5" />
            <line x1="12" y1="19" x2="19" y2="23" stroke="#5C9CFF" strokeWidth="1" opacity="0.5" />
            <line x1="37" y1="33" x2="44" y2="37" stroke="#5C9CFF" strokeWidth="1" opacity="0.5" />
            <line x1="44" y1="19" x2="37" y2="23" stroke="#5C9CFF" strokeWidth="1" opacity="0.5" />
            <line x1="19" y1="33" x2="12" y2="37" stroke="#5C9CFF" strokeWidth="1" opacity="0.5" />
          </svg>
          <span
            className="font-display text-2xl font-semibold tracking-tight"
            style={{ color: '#EAF0FF' }}
          >
            NexQloud
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-32 h-px bg-white/10 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                width: `${count}%`,
                background: 'linear-gradient(to right, #5c9cff, #9ca3ff)',
                transition: 'width 0.05s linear',
              }}
            />
          </div>
          <span
            ref={countRef}
            className="font-mono text-xs tabular-nums"
            style={{ color: '#8A93B8', minWidth: '2.5rem' }}
          >
            {count.toString().padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
