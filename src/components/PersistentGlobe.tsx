import { useEffect, useRef, useCallback } from 'react'
import createGlobe from 'cobe'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { globeNodes } from '../data'

// ─── Helpers ────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255]
}

const TIER_COLORS: Record<string, [number, number, number]> = {
  A: hexToRgb('#22D39B'),
  B: hexToRgb('#2DD4BF'),
  C: hexToRgb('#5C9CFF'),
  D: hexToRgb('#9CA3FF'),
}

// ─── Waypoint definitions ───────────────────────────────────────────────────
// cx/cy = center of globe as 0-1 fraction of viewport width/height
// vmin  = size as fraction of Math.min(vw, vh)

interface Waypoint {
  cx: number
  cy: number
  vmin: number
  opacity: number
  interactive: boolean
  dur?: number
  ease?: string
}

const WAYPOINTS: Record<string, Waypoint> = {
  hero: {
    cx: 0.5, cy: 0.5,
    vmin: 0.90, opacity: 1,
    interactive: true, dur: 1.6, ease: 'expo.out',
  },
  problem: {
    cx: 0.76, cy: 0.28,
    vmin: 0.44, opacity: 0.62,
    interactive: false, dur: 1.4, ease: 'expo.inOut',
  },
  trust: {
    cx: 0.16, cy: 0.62,
    vmin: 0.42, opacity: 0.58,
    interactive: false, dur: 1.3, ease: 'expo.inOut',
  },
  products: {
    cx: 0.84, cy: 0.22,
    vmin: 0.40, opacity: 0.55,
    interactive: false, dur: 1.2, ease: 'expo.inOut',
  },
  stakeholders: {
    cx: 0.20, cy: 0.54,
    vmin: 0.48, opacity: 0.60,
    interactive: false, dur: 1.3, ease: 'expo.inOut',
  },
  sustainability: {
    cx: 0.72, cy: 0.56,
    vmin: 0.44, opacity: 0.60,
    interactive: false, dur: 1.3, ease: 'expo.inOut',
  },
  network: {
    cx: 0.50, cy: 0.48,
    vmin: 0.62, opacity: 0.75,
    interactive: false, dur: 1.4, ease: 'expo.inOut',
  },
  monetization: {
    cx: 0.20, cy: 0.36,
    vmin: 0.38, opacity: 0.55,
    interactive: false, dur: 1.2, ease: 'expo.inOut',
  },
  cases: {
    cx: 0.80, cy: 0.52,
    vmin: 0.36, opacity: 0.50,
    interactive: false, dur: 1.2, ease: 'expo.inOut',
  },
  footer: {
    cx: 0.50, cy: 0.42,
    vmin: 0.56, opacity: 0.45,
    interactive: false, dur: 1.5, ease: 'expo.inOut',
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PersistentGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Globe state
  const phiRef = useRef(0.6)
  const thetaRef = useRef(0.18)
  const velX = useRef(0)
  const velY = useRef(0)
  const isDragging = useRef(false)
  const pointerInside = useRef(false)
  const autoRotating = useRef(true)
  const isInteractive = useRef(true)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollVelRef = useRef(1) // rotation speed multiplier, decays to 1

  const resumeAutoRotate = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => { autoRotating.current = true }, 1800)
  }, [])

  // ── Move the globe wrapper to a waypoint ────────────────────────────────
  const moveTo = useCallback((key: string) => {
    const wp = WAYPOINTS[key]
    if (!wp || !wrapRef.current) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const vm = Math.min(vw, vh)
    const size = wp.vmin * vm

    isInteractive.current = wp.interactive
    scrollVelRef.current = Math.max(scrollVelRef.current, 3)

    const wrap = wrapRef.current
    // pointer-events managed by CSS class toggle; set before animation
    wrap.style.pointerEvents = wp.interactive ? 'auto' : 'none'

    // Resize COBE canvas if size changed significantly
    if (canvasRef.current) {
      const cur = canvasRef.current.width
      if (Math.abs(cur - size) > 4) {
        canvasRef.current.width = size
        canvasRef.current.height = size
      }
    }

    gsap.to(wrap, {
      // left/top position the center point; translate(-50%,-50%) keeps it centered
      left: vw * wp.cx,
      top: vh * wp.cy,
      width: size,
      height: size,
      opacity: wp.opacity,
      duration: wp.dur ?? 1.3,
      ease: wp.ease ?? 'expo.inOut',
      overwrite: 'auto',
    })

    // Glow scales with size
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: wp.opacity * 0.9,
        scale: wp.interactive ? 1.18 : 1.1,
        duration: (wp.dur ?? 1.3) * 1.2,
        ease: 'expo.out',
        overwrite: 'auto',
      })
    }
  }, [])

  // ── COBE globe setup ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const vm = Math.min(window.innerWidth, window.innerHeight)
    const initSize = WAYPOINTS.hero.vmin * vm
    canvas.width = initSize
    canvas.height = initSize

    const markers = globeNodes.map((n) => ({
      location: [n.lat, n.lng] as [number, number],
      size: n.tier === 'A' ? 0.07 : n.tier === 'B' ? 0.055 : 0.042,
      color: TIER_COLORS[n.tier],
    }))

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: initSize,
      height: initSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 22000,
      mapBrightness: 7.5,
      mapBaseBrightness: 0.18,
      baseColor: hexToRgb('#0F2060'),
      markerColor: hexToRgb('#5C9CFF'),
      glowColor: hexToRgb('#2454A8'),
      markers,
    })

    let rafId = 0
    const tick = () => {
      rafId = requestAnimationFrame(tick)

      if (!isDragging.current) {
        velX.current *= 0.93
        velY.current *= 0.93
        phiRef.current += velX.current * 0.004
        thetaRef.current += velY.current * 0.004
      }

      if (autoRotating.current && !isDragging.current && !reduced) {
        phiRef.current += 0.0015 * Math.max(1, scrollVelRef.current)
        scrollVelRef.current = 1 + (scrollVelRef.current - 1) * 0.975
      }

      thetaRef.current = Math.max(-0.42, Math.min(0.42, thetaRef.current))

      // Keep canvas dims in sync with wrapper size
      const w = wrapRef.current?.offsetWidth ?? initSize
      if (Math.abs(canvas.width - w) > 8) {
        globe.update({ width: w, height: w })
      }

      globe.update({ phi: phiRef.current, theta: thetaRef.current })
    }
    rafId = requestAnimationFrame(tick)

    // ── Scroll velocity boost ────────────────────────────────────────────
    let lastScrollY = window.scrollY
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY)
      scrollVelRef.current = Math.min(6, 1 + delta * 0.06)
      lastScrollY = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Pointer events ──────────────────────────────────────────────────
    const onEnter = () => {
      pointerInside.current = true
      if (isInteractive.current) canvas.style.cursor = 'grab'
    }
    const onLeave = () => {
      pointerInside.current = false
      canvas.style.cursor = ''
      if (isDragging.current) { isDragging.current = false; resumeAutoRotate() }
    }
    const onDown = (e: PointerEvent) => {
      if (!isInteractive.current) return
      e.preventDefault()
      canvas.setPointerCapture(e.pointerId)
      isDragging.current = true
      autoRotating.current = false
      velX.current = 0; velY.current = 0
      canvas.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.movementX; const dy = e.movementY
      velX.current = velX.current * 0.25 + dx * 0.75
      velY.current = velY.current * 0.25 + dy * 0.75
      phiRef.current += dx * 0.006
      thetaRef.current += dy * 0.0035
    }
    const onUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      canvas.style.cursor = pointerInside.current ? 'grab' : ''
      resumeAutoRotate()
    }

    canvas.addEventListener('pointerenter', onEnter)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(rafId)
      globe.destroy()
      canvas.removeEventListener('pointerenter', onEnter)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', onScroll)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [resumeAutoRotate])

  // ── ScrollTrigger waypoints ─────────────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth < 768) return

    // Give DOM time to paint
    const timer = setTimeout(() => {
      const map: Array<[string, string]> = [
        ['#section-hero', 'hero'],
        ['#section-problem', 'problem'],
        ['#section-trust', 'trust'],
        ['#section-products', 'products'],
        ['#section-stakeholders', 'stakeholders'],
        ['#section-sustainability', 'sustainability'],
        ['#section-network', 'network'],
        ['#section-monetization', 'monetization'],
        ['#section-cases', 'cases'],
        ['#section-footer', 'footer'],
      ]

      map.forEach(([selector, key]) => {
        const el = document.querySelector(selector)
        if (!el) return

        ScrollTrigger.create({
          id: `globe-${key}`,
          trigger: el,
          start: 'top 60%',
          onEnter: () => moveTo(key),
          onEnterBack: () => moveTo(key),
        })
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id?.toString().startsWith('globe-')) st.kill()
      })
    }
  }, [moveTo])

  return (
    <div
      ref={wrapRef}
      data-persistent-globe
      aria-hidden
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: `${WAYPOINTS.hero.vmin * 100}vmin`,
        height: `${WAYPOINTS.hero.vmin * 100}vmin`,
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'auto',
        willChange: 'left, top, width, height, opacity',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Outer atmospheric glow */}
      <div
        ref={glowRef}
        data-globe-glow
        style={{
          position: 'absolute',
          inset: '-12%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(92,156,255,0.55) 0%, rgba(92,156,255,0.18) 38%, transparent 66%)',
          pointerEvents: 'none',
          opacity: 0,
          transformOrigin: 'center',
        }}
      />

      {/* Inner edge vignette */}
      <div
        style={{
          position: 'absolute',
          inset: '2%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(7,10,26,0.5) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <canvas
        ref={canvasRef}
        className="globe-canvas"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          touchAction: 'none',
          borderRadius: '50%',
        }}
      />
    </div>
  )
}
