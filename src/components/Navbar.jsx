import { useEffect, useMemo, useState } from 'react'
import logoImage from '../resource/logo.png'

function Navbar({
  links,
  onNavigate,
  onLanguageCycle,
  currentLanguageLabel,
  nextLanguageLabel,
  switchLanguageLabel,
  joinLabel,
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
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }

  return (
    <>
      <a
        href="#hero"
        onClick={(event) => handleNavigate(event, '#hero')}
        className="fixed left-5 top-4 z-50 inline-flex items-center"
      >
        <img src={logoImage} alt="IBEREX" className="h-10 w-auto object-contain lg:h-12" />
      </a>
      <div className="fixed right-5 top-5 z-50 hidden items-center gap-2 lg:flex">
        <button
          type="button"
          onClick={onLanguageCycle}
          aria-label={`${switchLanguageLabel}: ${nextLanguageLabel}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-slate-900/25 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
        >
          <span className="text-sm leading-none">🌐</span>
          <span>{currentLanguageLabel}</span>
        </button>
        <a
          href="#contact"
          onClick={(event) => handleNavigate(event, '#contact')}
          className="rounded-full border border-white/55 bg-slate-900/25 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-brand-600 hover:text-white"
        >
          {joinLabel}
        </a>
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-transparent lg:hidden">
        <nav className="mx-auto flex w-full items-center justify-between gap-4 px-5 py-3">
          <button
            type="button"
            onClick={onLanguageCycle}
            aria-label={`${switchLanguageLabel}: ${nextLanguageLabel}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-slate-900/35 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md"
          >
            <span className="text-xs leading-none">🌐</span>
            <span>{currentLanguageLabel}</span>
          </button>
          <div className="flex items-center gap-4">
          {navItems.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => handleNavigate(event, link.href)}
              className="text-xs font-medium text-white/85"
            >
              {link.label}
            </a>
          ))}
          </div>
        </nav>
      </header>

      <aside className="fixed left-5 top-1/2 z-40 hidden w-44 -translate-y-1/2 p-4 lg:block">
        <nav className="relative pl-5">
          <span className="absolute left-[7px] top-2 h-[calc(100%-0.5rem)] w-px bg-white/55"></span>
          <div className="space-y-5">
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavigate(event, link.href)}
                className={`group relative flex items-center text-sm font-medium transition-colors ${
                  activeId === link.href.replace('#', '')
                    ? 'text-cyan-200'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span className="absolute -left-5 inline-flex h-4 w-4 items-center justify-center">
                  <span
                    className={`rounded-full border border-cyan-300 transition-all ${
                      activeId === link.href.replace('#', '')
                        ? 'h-3 w-3 bg-cyan-300 shadow-[0_0_0_4px_rgba(103,232,249,0.28)]'
                        : 'h-2.5 w-2.5 bg-white group-hover:scale-110 group-hover:bg-cyan-300'
                    }`}
                  ></span>
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Navbar
