import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Hero() {
  const heroRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const heroElement = heroRef.current
    const panelElement = panelRef.current
    if (!heroElement || !panelElement) {
      return undefined
    }

    const canUseMouse = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    if (!canUseMouse.matches) {
      return undefined
    }

    const handleMouseMove = (event) => {
      const bounds = heroElement.getBoundingClientRect()
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5

      gsap.to(panelElement, {
        x: relativeX * 22,
        y: relativeY * 18,
        rotationY: relativeX * 5,
        rotationX: -relativeY * 4,
        transformPerspective: 1200,
        transformOrigin: 'center center',
        duration: 0.8,
        ease: 'power3.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(panelElement, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }

    heroElement.addEventListener('mousemove', handleMouseMove)
    heroElement.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove)
      heroElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="fade-in-section relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pb-20 lg:pt-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-brand-100/45 via-white/25 to-slate-50/15"></div>
      <div className="absolute inset-0 tech-grid opacity-35"></div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <div
            ref={panelRef}
            className="reveal-item rounded-3xl border border-white/60 bg-white/62 p-6 shadow-2xl shadow-brand-900/10 backdrop-blur-md sm:p-8 lg:p-10"
          >
            <p className="reveal-item mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Precision Electronics for Industry
            </p>
            <h1 className="reveal-item text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Advanced Semiconductor Solutions for Mission-Critical Systems
            </h1>
            <p className="reveal-item mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              NOVASEMI helps OEMs and industrial innovators accelerate product delivery with dependable
              components, scalable platforms, and expert engineering support.
            </p>
            <div className="reveal-item mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Contact Us
              </a>
              <a
                href="#products"
                className="rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
