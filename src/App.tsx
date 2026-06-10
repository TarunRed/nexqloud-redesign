import { useCallback, useEffect, useRef, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { PersistentGlobe } from './components/PersistentGlobe'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { ProblemSolution } from './components/sections/ProblemSolution'
import { TrustTier } from './components/sections/TrustTier'
import { Products } from './components/sections/Products'
import { Stakeholders } from './components/sections/Stakeholders'
import { Sustainability } from './components/sections/Sustainability'
import { NetworkStats } from './components/sections/NetworkStats'
import { Monetization } from './components/sections/Monetization'
import { CaseStudies } from './components/sections/CaseStudies'
import { CTAFooter } from './components/sections/CTAFooter'
import { initSmoothScroll, gsap, ScrollTrigger } from './lib/gsap'

export default function App() {
  const [ready, setReady] = useState(false)
  const globeRef = useRef<HTMLDivElement>(null)

  const handlePreloaderDone = useCallback(() => {
    setReady(true)
  }, [])

  // Smooth scroll
  useEffect(() => {
    if (!ready) return
    const lenis = initSmoothScroll()

    // Recalculate all ScrollTrigger positions now that Lenis owns the scroll.
    // Sections mount before Lenis is ready, so trigger offsets may be stale.
    let rafA = 0
    let rafB = 0
    rafA = requestAnimationFrame(() => {
      rafB = requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => {
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
      lenis.destroy()
    }
  }, [ready])

  // Animate globe into hero state once ready
  useEffect(() => {
    if (!ready) return
    const globe = document.querySelector<HTMLDivElement>('[data-persistent-globe]')
    if (!globe) return

    const vm = Math.min(window.innerWidth, window.innerHeight)
    const size = vm * 0.90

    gsap.to(globe, {
      opacity: 1,
      width: size,
      height: size,
      left: window.innerWidth * 0.5,
      top: window.innerHeight * 0.5,
      duration: 1.6,
      delay: 0.1,
      ease: 'expo.out',
    })

    const glow = globe.querySelector<HTMLElement>('[data-globe-glow]')
    if (glow) {
      gsap.to(glow, { opacity: 0.9, scale: 1.18, duration: 2, ease: 'expo.out', delay: 0.1 })
    }
  }, [ready])

  return (
    <>
      <Cursor />
      <Preloader onComplete={handlePreloaderDone} />

      {/* Grain noise overlay */}
      <div className="noise-overlay" aria-hidden />

      {/*
        PersistentGlobe lives OUTSIDE the content wrapper so it's always
        in the DOM and never re-mounts during section transitions.
        z-index 0 puts it behind all section content.
      */}
      <PersistentGlobe />

      <div
        ref={globeRef}
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: ready ? 'auto' : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Navbar />

        <main id="main-content">
          <Hero />
          <Marquee />
          <ProblemSolution />
          <TrustTier />
          <Products />
          <Stakeholders />
          <Sustainability />
          <NetworkStats />
          <Monetization />
          <CaseStudies />
        </main>

        <CTAFooter />
      </div>
    </>
  )
}
