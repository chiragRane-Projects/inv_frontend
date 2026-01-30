import React from 'react'

const TrustedBy = () => {
  const companies = ["LogiTech", "Amazonia", "FastFreight", "GlobalShip", "NextDay"]

  return (
    <section className="border-b bg-slate-50 py-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">
          Powering supply chains for next-gen companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((brand) => (
            <span key={brand} className="text-xl font-black text-slate-400">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedBy