function ProductsSection({ products }) {
  return (
    <section id="products" className="fade-in-section flex min-h-[100svh] items-center py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Products
          </p>
          <h2 className="reveal-item mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Engineered to Perform in Real-World Conditions
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((item) => (
            <article
              key={item.title}
              className="reveal-item rounded-2xl border border-slate-200/90 bg-white/65 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-xl">
                {item.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
