import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function TechnologySection({ advantages }) {
  const sectionRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const sectionElement = sectionRef.current
    const glowElement = glowRef.current
    if (!sectionElement || !glowElement) {
      return undefined
    }

    const cards = sectionElement.querySelectorAll('.tech-card')
    let floatingTween = null
    let floatingTimer = null
    let hasStartedFloating = false
    const startFloating = () => {
      if (hasStartedFloating) {
        return
      }
      hasStartedFloating = true
      floatingTween = gsap.to(cards, {
        y: -10,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.14,
          from: 'random',
        },
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }
          floatingTimer = window.setTimeout(startFloating, 720)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(sectionElement)

    const glowTween = gsap.to(glowElement, {
      rotate: 360,
      duration: 26,
      ease: 'none',
      repeat: -1,
    })

    const canUseMouse = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const handleMouseMove = (event) => {
      const bounds = sectionElement.getBoundingClientRect()
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5
      gsap.to(cards, {
        x: (index) => offsetX * (index % 2 === 0 ? 10 : -10),
        y: (index) => offsetY * (index % 2 === 0 ? 8 : -8),
        duration: 0.55,
        ease: 'power2.out',
      })
      gsap.to(glowElement, {
        x: offsetX * 24,
        y: offsetY * 20,
        duration: 0.8,
        ease: 'power3.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(cards, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.to(glowElement, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
    }

    if (canUseMouse.matches) {
      sectionElement.addEventListener('mousemove', handleMouseMove)
      sectionElement.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      observer.disconnect()
      if (floatingTimer) {
        window.clearTimeout(floatingTimer)
      }
      if (floatingTween) {
        floatingTween.kill()
      }
      glowTween.kill()
      if (canUseMouse.matches) {
        sectionElement.removeEventListener('mousemove', handleMouseMove)
        sectionElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="fade-in-section relative flex min-h-[100svh] items-center overflow-hidden py-16 lg:py-20"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(59,130,246,0.06)_36%,rgba(255,255,255,0)_70%)]"
      ></div>
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
        <div className="max-w-2xl">
          <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_8px_rgba(2,8,24,0.55)]">
            Technology Advantage
          </p>
          <h2 className="reveal-item mt-4 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_4px_14px_rgba(2,8,24,0.65)] sm:text-4xl">
            Built for Reliability, Scale, and Speed
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="tech-card reveal-item rounded-2xl border border-brand-100 bg-white/75 p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechnologySection
