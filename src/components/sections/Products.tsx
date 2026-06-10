import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { products } from '../../data'

function ProductCard({ product }: { product: typeof products[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(card, {
        rotateX: (-y / rect.height) * 10,
        rotateY: (x / rect.width) * 10,
        transformPerspective: 900,
        duration: 0.3,
        ease: 'power2.out',
      })
      const glow = card.querySelector('.card-glow') as HTMLElement
      if (glow) gsap.to(glow, { opacity: 1, x: x * 0.3, y: y * 0.3, duration: 0.3 })
    }

    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'expo.out' })
      const glow = card.querySelector('.card-glow') as HTMLElement
      if (glow) gsap.to(glow, { opacity: 0, x: 0, y: 0, duration: 0.5 })
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="navy-card card-hover p-6 flex flex-col gap-5 group relative overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        borderColor: product.accent + '18',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Glow */}
      <div
        className="card-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0"
        style={{ background: `radial-gradient(circle at center, ${product.accent}18 0%, transparent 60%)` }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: product.accent + '12', border: `1px solid ${product.accent}20` }}
      >
        <span>{product.icon}</span>
      </div>

      {/* Name + full */}
      <div>
        <div className="flex items-baseline gap-2.5 mb-1">
          <span
            className="font-display font-bold"
            style={{ fontSize: '1.25rem', color: product.accent, letterSpacing: '-0.02em' }}
          >
            {product.name}
          </span>
          <span
            className="font-mono"
            style={{ fontSize: '0.6875rem', color: '#3d5181' }}
          >
            {product.full}
          </span>
        </div>
      </div>

      <p
        className="font-body flex-1"
        style={{ color: '#7089c0', fontSize: '0.9375rem', lineHeight: 1.65 }}
      >
        {product.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono"
            style={{
              fontSize: '0.6875rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '0.375rem',
              background: product.accent + '0d',
              color: product.accent,
              border: `1px solid ${product.accent}18`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Learn more */}
      <div className="flex items-center gap-1.5 mt-1">
        <span
          className="font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontSize: '0.8125rem', color: product.accent }}
        >
          Learn more
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
          style={{ color: product.accent }}
        >
          <path d="M2 6H10M6.5 2L10 6L6.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

export function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (headingRef.current) {
          gsap.fromTo(
            Array.from(headingRef.current.children),
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }
          )
        }
        if (gridRef.current) {
          gsap.fromTo(
            Array.from(gridRef.current.children),
            { opacity: 0, y: 36, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out', delay: 0.15 }
          )
        }
      },
    })
  }, [])

  return (
    <section
      id="section-products"
      ref={sectionRef}
      className="py-32 section-pad"
      style={{
        background: 'rgba(8,13,44,0.68)',
        borderTop: '1px solid rgba(80,93,170,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <div className="eyebrow mb-5 opacity-0">Product Suite</div>
          <h2
            className="font-display text-white opacity-0"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Six products.<br />
            <span style={{ color: '#3d5181' }}>One unified platform.</span>
          </h2>
          <p
            className="font-body mt-5 mx-auto opacity-0"
            style={{ color: '#7089c0', fontSize: '1.0625rem', maxWidth: '48ch' }}
          >
            From raw compute to container registries — everything routes through Trust-Tier™.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
