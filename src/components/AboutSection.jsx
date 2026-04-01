function AboutSection({ content }) {
  return (
    <section
      id="about"
      className="fade-in-section flex min-h-[calc(100svh-72px)] items-center py-16 lg:py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div className="reveal-item relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/88 p-8 text-white backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/45 via-slate-900/95 to-slate-900/95"></div>
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-300/30 blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl"></div>
          <div className="relative">
            <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">
              {content.sinceLabel}
            </p>
            <h3 className="reveal-item mt-5 text-3xl font-semibold tracking-tight">
              {content.cardTitle}
            </h3>
            <p className="reveal-item mt-6 text-sm leading-7 text-slate-200">
              {content.cardDescription}
            </p>
          </div>
        </div>
        <div>
          <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_8px_rgba(2,8,24,0.55)]">
            {content.badge}
          </p>
          <h2 className="reveal-item mt-4 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_4px_14px_rgba(2,8,24,0.65)] sm:text-4xl">
            {content.title}
          </h2>
          <p className="reveal-item mt-6 text-base leading-7 text-slate-100 drop-shadow-[0_2px_10px_rgba(2,8,24,0.55)]">
            {content.description1}
          </p>
          <p className="reveal-item mt-4 text-base leading-7 text-slate-100 drop-shadow-[0_2px_10px_rgba(2,8,24,0.55)]">
            {content.description2}
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
