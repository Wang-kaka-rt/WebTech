import { useEffect, useMemo, useState } from 'react'

function Navbar({ links, onNavigate }) {
  const [activeId, setActiveId] = useState('')
  const navItems = useMemo(() => [{ label: 'Home', href: '#hero' }, ...links], [links])

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
        className="fixed left-5 top-5 z-50 rounded-md px-1 text-base font-semibold tracking-tight text-brand-900"
      >
        NOVASEMI
      </a>
      <a
        href="#contact"
        onClick={(event) => handleNavigate(event, '#contact')}
        className="fixed right-5 top-5 z-50 rounded-full border border-brand-600 bg-white/35 px-4 py-2 text-xs font-semibold text-brand-700 backdrop-blur-sm transition-colors hover:bg-brand-600 hover:text-white"
      >
        Contact Sales
      </a>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/35 backdrop-blur-sm lg:hidden">
        <nav className="mx-auto flex w-full items-center justify-end gap-4 px-5 py-3">
          {navItems.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => handleNavigate(event, link.href)}
              className="text-xs font-medium text-slate-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <aside className="fixed left-5 top-1/2 z-40 hidden w-44 -translate-y-1/2 rounded-2xl border border-transparent bg-transparent p-4 lg:block">
        <nav className="relative pl-5">
          <span className="absolute left-[7px] top-2 h-[calc(100%-0.5rem)] w-px bg-brand-300/70"></span>
          <div className="space-y-3">
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavigate(event, link.href)}
                className={`group relative flex items-center text-sm font-medium transition-colors ${
                  activeId === link.href.replace('#', '')
                    ? 'text-brand-700'
                    : 'text-slate-600 hover:text-brand-700'
                }`}
              >
                <span className="absolute -left-5 inline-flex h-4 w-4 items-center justify-center">
                  <span
                    className={`rounded-full border border-brand-500 transition-all ${
                      activeId === link.href.replace('#', '')
                        ? 'h-3 w-3 bg-brand-500 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]'
                        : 'h-2.5 w-2.5 bg-white group-hover:scale-110 group-hover:bg-brand-500'
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
