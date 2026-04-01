import { useEffect, useMemo, useState } from 'react'
import logoImage from '../resource/logo.png'

function Navbar({
  links,
  onNavigate,
  onLanguageCycle,
  currentLanguageLabel,
  nextLanguageLabel,
  switchLanguageLabel,
}) {
  const [activeId, setActiveId] = useState('')
  const navItems = useMemo(() => links, [links])

  useEffect(() => {
    const handleScrollSpy = () => {
      const middle = window.innerHeight * 0.4
      let current = ''

      navItems.forEach((link) => {
        const id = link.href.replace('#', '')
        const section = document.getElementById(id)
        if (!section) {
          return
        }
        const rect = section.getBoundingClientRect()
        if (rect.top <= middle && rect.bottom >= middle) {
          current = id
        }
      })

      setActiveId(current)
    }

    handleScrollSpy()
    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    window.addEventListener('resize', handleScrollSpy)
    return () => {
      window.removeEventListener('scroll', handleScrollSpy)
      window.removeEventListener('resize', handleScrollSpy)
    }
  }, [navItems])

  const handleNavigate = (event, href) => {
    event.preventDefault()
    if (onNavigate) {
      onNavigate(href)
      return
    }
    const target = document.querySelector(href)
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 lg:gap-6 lg:px-8">
        <a
          href="#hero"
          onClick={(event) => handleNavigate(event, '#hero')}
          className="inline-flex shrink-0 items-center"
        >
          <img src={logoImage} alt="IBEREX" className="h-11 w-auto object-contain lg:h-12" />
        </a>
        <nav className="flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center gap-3 lg:justify-center lg:gap-6">
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavigate(event, link.href)}
                className={`text-xs font-semibold transition-colors lg:text-sm ${
                  activeId === link.href.replace('#', '')
                    ? 'text-cyan-100'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onLanguageCycle}
            aria-label={`${switchLanguageLabel}: ${nextLanguageLabel}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/85 transition-colors hover:text-white lg:text-xs"
          >
            <span className="text-xs leading-none">🌐</span>
            <span>{currentLanguageLabel}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
