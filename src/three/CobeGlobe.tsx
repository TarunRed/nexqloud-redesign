import { useEffect, useRef, useCallback } from 'react'
import createGlobe from 'cobe'
import { globeNodes } from '../data'

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

interface CobeGlobeProps {
  className?: string
}

export function CobeGlobe({ className }: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0.6)
  const thetaRef = useRef(0.2)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velX = useRef(0)
  const velY = useRef(0)
  const pointerInside = useRef(false)
  const autoRotating = useRef(true)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resumeAutoRotate = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      autoRotating.current = true
    }, 1800)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    const markers = globeNodes.map((node) => ({
      location: [node.lat, node.lng] as [number, number],
      size: node.tier === 'A' ? 0.07 : node.tier === 'B' ? 0.055 : 0.042,
      color: TIER_COLORS[node.tier],
    }))

    const getSize = () =>
      Math.min(
        canvas.parentElement?.clientWidth ?? 700,
        canvas.parentElement?.clientHeight ?? 700,
        isMobile ? 380 : 780
      )

    let size = getSize()
    canvas.width = size
    canvas.height = size

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size,
      height: size,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 0.95,
      mapSamples: isMobile ? 10000 : 22000,
      mapBrightness: 5.5,
      mapBaseBrightness: 0.1,
      baseColor: hexToRgb('#0D1840'),
      markerColor: hexToRgb('#5C9CFF'),
      glowColor: hexToRgb('#19387A'),
      markers,
    })

    // ── Animation loop ────────────────────────────────────────────────────
    let rafId = 0
    const tick = () => {
      rafId = requestAnimationFrame(tick)

      if (!isDragging.current) {
        // Inertia decay
        velX.current *= 0.93
        velY.current *= 0.93
        phiRef.current += velX.current * 0.004
        thetaRef.current += velY.current * 0.004
      }

      // Auto-rotate
      if (autoRotating.current && !isDragging.current && !reduced) {
        phiRef.current += 0.0015
      }

      // Clamp vertical tilt
      thetaRef.current = Math.max(-0.42, Math.min(0.42, thetaRef.current))

      globe.update({ phi: phiRef.current, theta: thetaRef.current })
    }
    rafId = requestAnimationFrame(tick)

    // ── Pointer interaction ───────────────────────────────────────────────

    const onPointerEnter = () => {
      pointerInside.current = true
      canvas.style.cursor = 'grab'
    }

    const onPointerLeave = () => {
      pointerInside.current = false
      canvas.style.cursor = ''
      if (isDragging.current) {
        isDragging.current = false
        resumeAutoRotate()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      isDragging.current = true
      autoRotating.current = false
      lastPointer.current = { x: e.clientX, y: e.clientY }
      velX.current = 0
      velY.current = 0
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }

      // Blend velocity for smooth feel
      velX.current = velX.current * 0.25 + dx * 0.75
      velY.current = velY.current * 0.25 + dy * 0.75

      phiRef.current += dx * 0.006
      thetaRef.current += dy * 0.0035
    }

    const onPointerUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      canvas.style.cursor = pointerInside.current ? 'grab' : ''
      resumeAutoRotate()
    }

    canvas.addEventListener('pointerenter', onPointerEnter)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      size = getSize()
      canvas.width = size
      canvas.height = size
      globe.update({ width: size, height: size })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      globe.destroy()
      canvas.removeEventListener('pointerenter', onPointerEnter)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('resize', onResize)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [resumeAutoRotate])

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Outer atmospheric glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(92,156,255,0.22) 0%, rgba(92,156,255,0.07) 38%, transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden
      />
      {/* Inner edge darkening */}
      <div
        style={{
          position: 'absolute',
          inset: '2%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, transparent 52%, rgba(7,10,26,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
        aria-hidden
      />

      <canvas
        ref={canvasRef}
        className="globe-canvas"
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
