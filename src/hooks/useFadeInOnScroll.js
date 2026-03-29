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
            duration: 0.85,
            stagger: 0.09,
            ease: 'power3.out',
          })
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.22,
      },
    )

    sections.forEach((section) => {
      const revealItems = section.querySelectorAll('.reveal-item')
      const targets = revealItems.length ? revealItems : [section]
      gsap.set(targets, {
        opacity: 0,
        y: 34,
        filter: 'blur(8px)',
        scale: 0.985,
      })
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [selector])
}

export default useFadeInOnScroll
