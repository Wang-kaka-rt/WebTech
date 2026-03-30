function ContactSection({ content }) {
  return (
    <section id="contact" className="fade-in-section flex min-h-[100svh] items-center py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 rounded-3xl border border-slate-200/90 bg-white/70 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-2 lg:p-12">
        <div>
          <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            {content.badge}
          </p>
          <h2 className="reveal-item mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="reveal-item mt-6 text-base leading-7 text-slate-600">
            {content.description}
          </p>
          <div className="reveal-item mt-8 space-y-3 text-sm text-slate-600">
            <p className="reveal-item">{content.address}</p>
            <p className="reveal-item">{content.phone}</p>
            <p className="reveal-item">{content.email}</p>
          </div>
        </div>
        <form className="reveal-item space-y-4">
          <input
            type="text"
            placeholder={content.form.name}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-brand-500"
          />
          <input
            type="email"
            placeholder={content.form.email}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-brand-500"
          />
          <textarea
            rows={4}
            placeholder={content.form.message}
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-brand-500"
          ></textarea>
          <button
            type="button"
            className="rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {content.form.submit}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactSection
