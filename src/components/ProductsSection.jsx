import logoImage from '../resource/logo.png'
import cardBgImage from '../assets/hero.png'

function ProductsSection({ products, content }) {
  const cardImageClasses = [
    'scale-110 object-[18%_42%] hue-rotate-[0deg] saturate-[120%]',
    'scale-[1.18] object-[78%_40%] hue-rotate-[28deg] saturate-[128%]',
    'scale-[1.16] object-[60%_28%] hue-rotate-[58deg] saturate-[135%]',
    'scale-[1.2] object-[32%_78%] hue-rotate-[96deg] saturate-[130%]',
    'scale-[1.16] object-[84%_70%] hue-rotate-[132deg] saturate-[138%]',
    'scale-[1.22] object-[50%_54%] hue-rotate-[168deg] saturate-[145%]',
  ]

  const cardOverlayClasses = [
    'bg-[linear-gradient(156deg,rgba(8,27,62,0.68)_0%,rgba(38,126,246,0.36)_52%,rgba(182,220,255,0.18)_100%)]',
    'bg-[linear-gradient(156deg,rgba(14,30,60,0.7)_0%,rgba(17,139,178,0.4)_50%,rgba(218,243,255,0.2)_100%)]',
    'bg-[linear-gradient(156deg,rgba(16,28,56,0.7)_0%,rgba(84,109,235,0.42)_54%,rgba(215,228,255,0.2)_100%)]',
    'bg-[linear-gradient(156deg,rgba(12,23,52,0.7)_0%,rgba(27,125,208,0.4)_52%,rgba(188,241,255,0.2)_100%)]',
    'bg-[linear-gradient(156deg,rgba(10,22,48,0.72)_0%,rgba(17,98,198,0.45)_53%,rgba(200,230,255,0.2)_100%)]',
    'bg-[linear-gradient(156deg,rgba(8,20,44,0.72)_0%,rgba(60,104,214,0.44)_51%,rgba(210,227,255,0.2)_100%)]',
  ]

  return (
    <section id="products" className="fade-in-section flex min-h-[100svh] items-center py-10 lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center lg:gap-8 lg:px-8">
        <div className="flex h-full flex-col items-start justify-center">
          <div className="reveal-item inline-flex">
            <img src={logoImage} alt="IBEREX" className="h-24 w-auto object-contain lg:h-28" />
          </div>
          <div className="mt-5">
            <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_8px_rgba(2,8,24,0.55)]">
              {content.badge}
            </p>
            <h2 className="reveal-item mt-3 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_4px_14px_rgba(2,8,24,0.65)] sm:text-4xl">
              {content.title}
            </h2>
          </div>
        </div>
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
          {products.map((item, index) => (
            <article
              key={item.title}
              className="reveal-item relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-slate-900/25 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <img
                src={cardBgImage}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 ${cardImageClasses[index % cardImageClasses.length]}`}
              />
              <div
                className={`pointer-events-none absolute inset-0 ${cardOverlayClasses[index % cardOverlayClasses.length]}`}
              ></div>
              <div className="relative z-10 flex h-full flex-col">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/85 text-xl">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-[1.35rem] font-semibold leading-8 text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-100">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
