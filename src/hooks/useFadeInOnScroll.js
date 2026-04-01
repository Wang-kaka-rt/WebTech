import { useEffect } from 'react'
import gsap from 'gsap'

const useFadeInOnScroll = (selector) => {
  useEffect(() => {
    const sections = gsap.utils.toArray(selector)
    if (!sections.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          const revealItems = entry.target.querySelectorAll('.reveal-item')
          const targets = revealItems.length ? revealItems : [entry.target]
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power2.out',
          })
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    sections.forEach((section) => {
      const revealItems = section.querySelectorAll('.reveal-item')
      const targets = revealItems.length ? revealItems : [section]
      gsap.set(targets, {
        opacity: 0,
        y: 22,
        filter: 'blur(4px)',
        scale: 0.992,
      })
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [selector])
}

export default useFadeInOnScroll
