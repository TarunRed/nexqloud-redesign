import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current!
    const ring = ringRef.current!

    let mx = 0, my = 0
    let rx = 0, ry = 0
    let visible = true
    let rafId = 0

    const showCursor = () => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 })
      }
    }
    const hideCursor = () => {
      if (visible) {
        visible = false
        gsap.to([dot, ring], { opacity: 0, duration: 0.15 })
      }
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      gsap.to(dot, { x: mx, y: my, duration: 0.07, ease: 'power3.out' })

      // Hide custom cursor when over the COBE globe (which shows a real hand)
      const el = document.elementFromPoint(mx, my)
      if (el?.classList.contains('globe-canvas')) {
        hideCursor()
      } else {
        showCursor()
      }
    }

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 2.4, opacity: 0.5, duration: 0.3, ease: 'expo.out' })
      gsap.to(dot, { scale: 0.35, duration: 0.3, ease: 'expo.out' })
    }

    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' })
      gsap.to(dot, { scale: 1, duration: 0.4, ease: 'expo.out' })
    }

    const tick = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      gsap.set(ring, { x: rx, y: ry })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })

    const bindInteractables = () => {
      document.querySelectorAll('a, button, [data-cursor-scale]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
    }

    bindInteractables()

    const observer = new MutationObserver(bindInteractables)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Dot — snaps directly to cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}
      >
        <div
          className="w-2 h-2 rounded-full bg-accent-blue"
          style={{ mixBlendMode: 'difference' }}
        />
      </div>

      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}
      >
        <div
          className="w-9 h-9 rounded-full"
          style={{
            border: '1px solid rgba(92,156,255,0.5)',
            mixBlendMode: 'difference',
          }}
        />
      </div>
    </>
  )
}
