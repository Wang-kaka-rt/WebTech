import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import logoImage from '../resource/logo.png'

function Hero({ content }) {
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
      className="fade-in-section relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden py-14 lg:py-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-6 lg:px-8 lg:pt-10">
        <div className="mx-auto max-w-4xl">
          <div
            ref={panelRef}
            className="reveal-item bg-transparent p-6 text-center sm:p-8 lg:p-10"
          >
            <div className="reveal-item mb-6 flex justify-center">
              <img src={logoImage} alt="IBEREX" className="h-16 w-auto object-contain sm:h-20 lg:h-24" />
            </div>
            <h1 className="reveal-item text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_4px_14px_rgba(2,8,24,0.65)] sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="reveal-item mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-100 drop-shadow-[0_2px_10px_rgba(2,8,24,0.55)] sm:text-lg">
              {content.description1}
            </p>
            <p className="reveal-item mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-100 drop-shadow-[0_2px_10px_rgba(2,8,24,0.55)] sm:text-lg">
              {content.description2}
            </p>
            <div className="reveal-item mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#about"
                className="rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-700"
              >
                {content.primaryButton}
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/45 bg-white/12 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/18"
              >
                {content.secondaryButton}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
