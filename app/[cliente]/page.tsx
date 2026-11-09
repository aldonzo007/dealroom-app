import Link from "next/link";
import { notFound } from "next/navigation";
import { getCliente, getInmueblesDisponibles } from "@/lib/data";
import InmuebleCard from "@/components/InmuebleCard";

export default async function DirectorioHome({ params }: { params: Promise<{ cliente: string }> }) {
  const { cliente: slug } = await params;
  const cliente = await getCliente(slug);
  if (!cliente) notFound();

  const inmuebles = await getInmueblesDisponibles(cliente.id);
  const primary = cliente.color_primario || "#C5A059";
  const broker = cliente.broker_nombre;
  const brokerFoto = cliente.broker_foto_url;
  const brokerTitulo = cliente.broker_titulo || "Real Estate Advisor";

  return (
    <main className="min-h-screen bg-cream text-navy-900">
      {/* Nav */}
      <nav className="border-b border-navy-900/10 bg-cream/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {cliente.logo_url ? (
              <img src={cliente.logo_url} alt={cliente.nombre} className="h-8" />
            ) : (
              <span className="serif text-xl font-semibold tracking-tight">{cliente.nombre}</span>
            )}
            <span className="hidden md:inline-block w-px h-5 bg-navy-900/15" />
            <span className="hidden md:inline-block text-xs tracking-[0.25em] uppercase text-navy-900/50 font-medium">Portafolio</span>
          </div>
          <Link href={`/${slug}/wizard`} className="px-5 py-2.5 text-sm font-semibold text-white rounded-md transition-opacity hover:opacity-90" style={{ background: primary }}>
            Encuentra tu propiedad
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy-900/5">
        <div className="absolute inset-0">
          {inmuebles[0]?.fotos[0] ? (
            <img src={inmuebles[0].fotos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cream to-navy-900/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-transparent to-cream/60" />
        </div>
        <div className="relative container mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-16 lg:pb-20">
          <div className="text-[11px] tracking-[0.35em] uppercase text-navy-900/60 font-medium mb-7">
            {cliente.nombre} <span className="opacity-40 mx-2">|</span> Portafolio
          </div>
          <h1 className="serif text-[42px] md:text-6xl lg:text-7xl leading-[1.02] font-medium max-w-3xl mb-8">
            Propiedades de alto patrimonio, seleccionadas para ti.
          </h1>
          <p className="text-navy-900/70 max-w-xl text-[15px] leading-relaxed mb-10">
            Responde unas preguntas y recibe al instante una selección curada que coincide con tu perfil de inversión, presupuesto y objetivos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${slug}/wizard`} className="inline-flex items-center gap-2 px-7 py-4 font-semibold text-white rounded-md text-sm transition-opacity hover:opacity-90" style={{ background: primary }}>
              Comenzar mi búsqueda →
            </Link>
            <a href="#catalogo" className="inline-flex items-center gap-2 px-7 py-4 font-semibold border border-navy-900/20 rounded-md text-sm hover:border-navy-900/40 transition-colors">
              Ver catálogo
            </a>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="py-14 lg:py-20">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10 border-b border-navy-900/10 pb-5">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase font-medium mb-2" style={{ color: primary }}>Portafolio</div>
              <h2 className="serif text-3xl lg:text-4xl font-medium">Propiedades disponibles</h2>
            </div>
            <span className="text-navy-900/50 text-sm">{inmuebles.length} inmuebles</span>
          </div>
          {inmuebles.length === 0 ? (
            <p className="text-navy-900/50">Catálogo en actualización. Contacta a tu asesor para opciones disponibles.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inmuebles.map((inm) => (
                <InmuebleCard key={inm.id} inm={inm} href={`/${slug}/inmueble/${inm.id}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Asesor CTA */}
      {broker && (
        <section className="bg-white border-y border-navy-900/5">
          <div className="container mx-auto px-6 lg:px-10 py-14 lg:py-16">
            <div className="grid md:grid-cols-3 gap-8 items-center max-w-4xl mx-auto">
              <div className="text-center md:text-left">
                {brokerFoto ? (
                  <img src={brokerFoto} alt={broker} className="w-28 h-28 rounded-full object-cover mx-auto md:mx-0 ring-4 ring-cream" />
                ) : (
                  <div className="w-28 h-28 rounded-full mx-auto md:mx-0 flex items-center justify-center ring-4 ring-cream" style={{ background: `${primary}15` }}>
                    <span className="serif text-4xl font-medium" style={{ color: primary }}>{broker.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 text-center md:text-left">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium mb-2" style={{ color: primary }}>Tu asesor</div>
                <h3 className="serif text-3xl font-medium mb-1">{broker}</h3>
                <div className="text-xs tracking-[0.25em] uppercase text-navy-900/50 mb-4">{brokerTitulo}</div>
                <p className="text-navy-900/70 text-sm leading-relaxed mb-6 max-w-xl">
                  Te acompaño en la evaluación de oportunidades, coordinación de visitas y análisis financiero.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {(cliente.broker_calendar_url || cliente.calendar_url) && (
                    <a href={cliente.broker_calendar_url || cliente.calendar_url || "#"} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-md hover:opacity-90 transition-opacity" style={{ background: primary }}>
                      Agendar llamada
                    </a>
                  )}
                  {cliente.broker_whatsapp && (
                    <a href={`https://wa.me/${cliente.broker_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border border-navy-900/20 rounded-md hover:border-navy-900/40 transition-colors">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-navy-900 text-white/40 py-7 text-center text-[11px] tracking-[0.15em] border-t border-white/5">
        © {new Date().getFullYear()} {cliente.nombre} · Portafolio privado · Estimaciones sujetas a dictamen legal y validación notarial
      </footer>
    </main>
  );
}
