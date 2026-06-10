import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const ctaCards = [
  {
    icon: '⬡',
    title: 'Deploy my first workload',
    desc: 'Launch compute or AI workloads on the right tier — instantly. Free tier includes 200 vCPU-hours/month.',
    cta: 'Start Free',
    accent: '#5c9cff',
    href: '#',
  },
  {
    icon: '◇',
    title: 'Contribute my infrastructure',
    desc: 'Earn by adding your idle compute to NexQloud. Setup in under 20 minutes.',
    cta: 'Become a Node',
    accent: '#22d39b',
    href: '#',
  },
  {
    icon: '⬢',
    title: 'Explore enterprise solutions',
    desc: 'See how NexQloud fits your scale, compliance, and cost goals. Talk to a solutions architect.',
    cta: 'Talk to Sales',
    accent: '#2dd4bf',
    href: '#',
  },
  {
    icon: '◈',
    title: 'Request a technical deep dive',
    desc: 'Architecture whitepaper, Trust-Tier™ spec, and API reference. Get expert insights.',
    cta: 'Read the Docs',
    accent: '#9ca3ff',
    href: '#',
  },
]

// Stable star positions — generated once at module load, not per render
const STARS = Array.from({ length: 50 }, () => ({
  size: Math.random() * 1.5 + 0.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  opacity: Math.random() * 0.18 + 0.04,
}))

const footerLinks = {
  Products: ['DKS Kubernetes', 'DC2 Virtual Machines', 'DAI AI Compute', 'DCA Cloud Aggregator', 'DCX Cloud Exchange', 'DCR Container Registry'],
  Solutions: ['AI & ML Startups', 'Web3 & Blockchain', 'Healthcare & Legal', 'Media & Gaming', 'Public Sector', 'Technology & SMB'],
  Company: ['About us', 'Press & Media', 'Pricing', 'Trust-Tier™', 'Developers', 'Careers', 'Privacy Policy', 'Terms'],
}

export function CTAFooter() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (gridRef.current) {
          gsap.fromTo(
            Array.from(gridRef.current.children),
            { opacity: 0, y: 36, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'expo.out' }
          )
        }
      },
    })

    ScrollTrigger.create({
      trigger: wordmarkRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }
        )
      },
    })
  }, [])

  return (
    <footer
      id="section-footer"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'rgba(8,13,44,0.72)',
        borderTop: '1px solid rgba(80,93,170,0.15)',
      }}
    >
      {/* Subtle star field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              top: `${s.top}%`,
              left: `${s.left}%`,
              background: '#ffffff',
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="section-pad pt-32 pb-24 max-w-7xl mx-auto relative z-10">

        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="eyebrow mb-5">Get Started</div>
          <h2
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            You deserve a cloud<br />
            <span style={{ color: '#3d5181' }}>as smart as your data.</span>
          </h2>
          <p
            className="font-body mt-5 mx-auto"
            style={{ color: '#7089c0', fontSize: '1.0625rem', maxWidth: '52ch' }}
          >
            With NexQloud DCP, your workloads route smarter, cost less, and run exactly on the
            tier they belong — not just one legacy tier.
          </p>
        </div>

        {/* CTA grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-28">
          {ctaCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="navy-card card-hover p-6 flex flex-col gap-4 group relative"
              style={{ borderColor: card.accent + '18' }}
            >
              <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
              <div>
                <div
                  className="font-display font-semibold text-white mb-2"
                  style={{ fontSize: '0.9375rem' }}
                >
                  {card.title}
                </div>
                <p className="font-body" style={{ color: '#7089c0', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>
              <div
                className="font-body font-medium flex items-center gap-1.5 mt-auto"
                style={{ color: card.accent, fontSize: '0.875rem' }}
              >
                {card.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M6.5 2L10 6L6.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Giant wordmark */}
        <div ref={wordmarkRef} className="text-center mb-20 opacity-0">
          <div
            className="font-display font-black select-none leading-none"
            style={{
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              background: 'linear-gradient(135deg, rgba(92,156,255,0.08), rgba(112,137,192,0.05))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
            }}
          >
            NexQloud
          </div>
        </div>

        {/* Footer links */}
        <div style={{ borderTop: '1px solid rgba(80,93,170,0.12)' }} className="pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Logo col */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <svg width="22" height="22" viewBox="0 0 56 56" fill="none">
                  <polygon points="28,4 50,16 50,40 28,52 6,40 6,16" stroke="#5c9cff" strokeWidth="1.5" fill="none" opacity="0.5" />
                  <circle cx="28" cy="28" r="4.5" fill="#5c9cff" />
                </svg>
                <span className="font-display font-semibold text-white" style={{ fontSize: '0.9375rem' }}>NexQloud</span>
              </div>
              <p className="font-body" style={{ color: '#3d5181', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                Building decentralized cloud computing through sustainable, community-powered infrastructure.
              </p>
            </div>

            {/* Link cols */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <div className="eyebrow mb-4" style={{ color: '#3d5181', fontSize: '0.5625rem' }}>{group}</div>
                <div className="flex flex-col gap-2.5">
                  {links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="font-body"
                      style={{ color: '#7089c0', fontSize: '0.875rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#7089c0')}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(80,93,170,0.10)', paddingTop: '1.5rem' }}>
            <p className="font-mono" style={{ color: '#3d5181', fontSize: '0.6875rem' }}>
              © 2025 NexQloud Technologies, Inc. · All core systems protected by U.S. patent filings. · ESG-aligned architecture.
            </p>
            <div className="flex items-center gap-5">
              {['X', 'GitHub', 'LinkedIn', 'Discord'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-mono"
                  style={{ fontSize: '0.6875rem', color: '#3d5181', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#7089c0')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3d5181')}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
