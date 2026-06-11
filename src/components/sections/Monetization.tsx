import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const steps = [
  { icon: '⬡', label: 'Register Node', desc: 'Connect your hardware to the NexQloud network in under 20 minutes.' },
  { icon: '⚡', label: 'Serve Workloads', desc: 'Your node automatically routes Tier C/D workloads.' },
  { icon: '◈', label: 'Earn NXQ', desc: 'Every compute-hour earns you NXQ tokens in real-time.' },
  { icon: '◇', label: 'Cash Out', desc: 'Convert NXQ to USD, BTC, or hold for scarcity rewards.' },
]

export function Monetization() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.fromTo(leftRef.current, { opacity: 0, x: -36 }, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' })
        gsap.fromTo(rightRef.current, { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out', delay: 0.12 })
      },
    })
  }, [])

  return (
    <section
      id="section-monetization"
      ref={sectionRef}
      className="py-32 section-pad relative overflow-hidden"
      style={{
        background: 'rgba(8,13,44,0.68)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      {/* Subtle violet glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 45% 55% at 70% 50%, rgba(92,156,255,0.05) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div ref={leftRef} style={{ opacity: 0 }}>
            <div className="eyebrow mb-5" style={{ color: '#5c9cff' }}>Earn with NexQloud</div>
            <h2
              className="font-display font-semibold text-white mb-6"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              Decentralized earnings.<br />
              <span style={{ color: '#6878a8', fontWeight: 300 }}>Real-world impact.</span>
            </h2>
            <p
              className="font-body mb-8"
              style={{ color: '#7089c0', fontSize: '1.0625rem', lineHeight: 1.7 }}
            >
              NXQ is a deflationary utility token with a Bitcoin-like 21M hard cap. Early node
              contributors earn the highest block rewards. As the network grows, your early stake
              appreciates. Earn reliable passive income by contributing your unused compute power.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-4 mb-8">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: 'rgba(92,156,255,0.08)',
                      border: '1px solid rgba(92,156,255,0.18)',
                      fontSize: '1rem',
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white" style={{ fontSize: '0.9375rem' }}>{step.label}</div>
                    <div className="font-body" style={{ color: '#7089c0', fontSize: '0.875rem', marginTop: '0.125rem' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>
                Become a Node Partner
              </a>
              <a href="#" className="btn-outline" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>
                NXQ Whitepaper →
              </a>
            </div>
          </div>

          {/* Right */}
          <div ref={rightRef} style={{ opacity: 0 }}>
            <div
              className="navy-card p-6 flex flex-col gap-5"
              style={{ borderColor: 'rgba(92,156,255,0.15)' }}
            >
              {/* Token header */}
              <div
                className="flex items-center justify-between pb-5"
                style={{ borderBottom: '1px solid rgba(80,93,170,0.15)' }}
              >
                <div>
                  <div className="eyebrow mb-1" style={{ color: '#6878a8', fontSize: '0.5625rem' }}>NXQ Token</div>
                  <div
                    className="font-display font-bold text-white"
                    style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}
                  >
                    21M
                  </div>
                  <div className="font-body" style={{ color: '#7089c0', fontSize: '0.8125rem' }}>Hard cap · Bitcoin-like scarcity</div>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #5c9cff, #7089c0)',
                    boxShadow: '0 0 28px rgba(92,156,255,0.25)',
                  }}
                >
                  <span className="font-display font-bold text-white" style={{ fontSize: '1.25rem' }}>N</span>
                </div>
              </div>

              {/* Earnings calculator */}
              <div>
                <div className="eyebrow mb-4" style={{ color: '#6878a8', fontSize: '0.5625rem' }}>Node Earnings Calculator</div>
                {[
                  { tier: 'Tier C', nodes: 1, monthly: '$487', nxq: '12.4 NXQ/day' },
                  { tier: 'Tier D', nodes: 3, monthly: '$1,240', nxq: '31.8 NXQ/day' },
                ].map((row) => (
                  <div
                    key={row.tier}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(80,93,170,0.10)' }}
                  >
                    <div>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: '#7089c0' }}>
                        {row.tier} · {row.nodes} node{row.nodes > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-white" style={{ fontSize: '0.9375rem' }}>
                        {row.monthly}
                        <span style={{ color: '#7089c0', fontWeight: 400 }}>/mo</span>
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.625rem', color: '#5c9cff' }}>{row.nxq}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scarcity notice */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(92,156,255,0.06)', border: '1px solid rgba(92,156,255,0.14)' }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚡</span>
                <p className="font-body" style={{ color: '#7089c0', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  <span className="text-white font-medium">Early contributors earn more.</span> Block rewards halve
                  every 2.1M NXQ minted. Only 8.7M NXQ remain in the current reward epoch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
