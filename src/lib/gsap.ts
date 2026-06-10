import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { TextPlugin } from 'gsap/TextPlugin'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin)

let lenis: Lenis | null = null

export function initSmoothScroll(): Lenis {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis(): Lenis | null {
  return lenis
}

export function splitTextIntoSpans(el: HTMLElement): HTMLElement[] {
  const text = el.innerText
  el.innerHTML = ''
  const spans: HTMLElement[] = []

  for (const char of text) {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.style.overflow = 'hidden'
    const inner = document.createElement('span')
    inner.style.display = 'inline-block'
    inner.textContent = char === ' ' ? ' ' : char
    span.appendChild(inner)
    el.appendChild(span)
    spans.push(inner)
  }

  return spans
}

export function animateHeadlineIn(
  el: HTMLElement,
  delay = 0,
  reduced = false
): gsap.core.Timeline {
  if (reduced) {
    return gsap.timeline().fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, delay })
  }

  const words = el.innerText.split(' ')
  el.innerHTML = words
    .map(
      (w) =>
        `<span style="display:inline-block;overflow:hidden;margin-right:0.3em"><span style="display:inline-block">${w}</span></span>`
    )
    .join('')

  const inner = Array.from(el.querySelectorAll('span > span')) as HTMLElement[]

  return gsap
    .timeline({ delay })
    .fromTo(
      inner,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: 'expo.out',
      }
    )
}

export function revealOnScroll(
  el: HTMLElement | HTMLElement[],
  opts: {
    y?: number
    stagger?: number
    delay?: number
    trigger?: Element
    start?: string
  } = {}
): ScrollTrigger {
  const elements = Array.isArray(el) ? el : [el]
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  gsap.set(elements, { opacity: 0, y: reduced ? 0 : opts.y ?? 40 })

  return ScrollTrigger.create({
    trigger: opts.trigger ?? elements[0],
    start: opts.start ?? 'top 85%',
    onEnter: () => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.3 : 0.9,
        stagger: opts.stagger ?? 0.08,
        delay: opts.delay ?? 0,
        ease: 'expo.out',
      })
    },
  })
}

export { gsap, ScrollTrigger }
