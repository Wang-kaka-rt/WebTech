function AboutSection() {
  return (
    <section id="about" className="fade-in-section flex min-h-[100svh] items-center py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div className="reveal-item relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/88 p-8 text-white backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/45 via-slate-900/95 to-slate-900/95"></div>
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-300/30 blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl"></div>
          <div className="relative">
            <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">
              Since 2008
            </p>
            <h3 className="reveal-item mt-5 text-3xl font-semibold tracking-tight">
              Trusted by Industrial Innovators
            </h3>
            <p className="reveal-item mt-6 text-sm leading-7 text-slate-200">
              We partner with automation leaders, energy platforms, and enterprise OEMs to deliver
              dependable electronics for long lifecycle programs.
            </p>
          </div>
        </div>
        <div>
          <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            About NOVASEMI
          </p>
          <h2 className="reveal-item mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Engineering-Centric Teams with Global Delivery Capability
          </h2>
          <p className="reveal-item mt-6 text-base leading-7 text-slate-600">
            NOVASEMI is a B2B technology company focused on semiconductor and embedded electronics.
            Our cross-functional teams combine chip design, manufacturing quality systems, and field
            application engineering to support every phase from prototype to mass production.
          </p>
          <p className="reveal-item mt-4 text-base leading-7 text-slate-600">
            We help enterprise clients reduce risk, optimize cost, and launch faster with transparent
            communication, proven technical roadmaps, and long-term partnership models.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
