function Footer({ content }) {
  return (
    <footer className="fade-in-section border-t border-slate-200/90 bg-white/60 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row lg:px-8">
        <div className="reveal-item flex gap-6">
          <a className="reveal-item transition-colors hover:text-brand-700" href="#products">
            {content.links.products}
          </a>
          <a className="reveal-item transition-colors hover:text-brand-700" href="#about">
            {content.links.about}
          </a>
          <a className="reveal-item transition-colors hover:text-brand-700" href="#contact">
            {content.links.contact}
          </a>
        </div>
        <p className="reveal-item">© {new Date().getFullYear()} {content.copyright}</p>
      </div>
    </footer>
  )
}

export default Footer
