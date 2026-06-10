import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

const NAV_LINKS = ['Products', 'Solutions', 'Pricing', 'Enterprise', 'Partners']

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 2.4 }
    )
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[9990] section-pad py-5"
      style={{
        background: scrolled ? 'rgba(8,13,44,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(80,93,170,0.12)' : '1px solid transparent',
        transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
        opacity: 0,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
          <svg width="26" height="26" viewBox="0 0 56 56" fill="none">
            <polygon
              points="28,4 50,16 50,40 28,52 6,40 6,16"
              stroke="#5c9cff"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <polygon
              points="28,14 42,22 42,34 28,42 14,34 14,22"
              stroke="#5c9cff"
              strokeWidth="1"
              fill="rgba(92,156,255,0.08)"
            />
            <circle cx="28" cy="28" r="4.5" fill="#5c9cff" />
          </svg>
          <span
            className="font-display font-semibold text-white"
            style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}
          >
            NexQloud
          </span>
        </a>

        {/* Nav links with Lucien-style sliding underline */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="nav-link font-body text-sm"
              style={{ color: '#7089c0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#7089c0')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <a
            href="#"
            className="nav-link hidden md:block font-body text-sm"
            style={{ color: '#7089c0' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7089c0')}
          >
            Sign in
          </a>
          <a
            href="#"
            className="btn-primary"
            style={{ fontSize: '0.8125rem', padding: '0.6rem 1.25rem' }}
          >
            Deploy Now
          </a>
        </div>
      </div>
    </nav>
  )
}
