import Link from "next/link";
import { notFound } from "next/navigation";
import { getCliente, getInmueblesDisponibles } from "@/lib/data";
import InmuebleCard from "@/components/InmuebleCard";

export default async function DirectorioHome({ params }: { params: Promise<{ cliente: string }> }) {
  const { cliente: slug } = await params;
  const cliente = await getCliente(slug);
  if (!cliente) notFound();

  const inmuebles = await getInmueblesDisponibles(cliente.id);

  return (
    <main className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-navy-900/10 bg-cream/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {cliente.logo_url ? (
              <img src={cliente.logo_url} alt={cliente.nombre} className="h-8" />
            ) : (
              <span className="serif text-xl text-navy-900">{cliente.nombre}</span>
            )}
          </div>
          <Link href={`/${slug}/wizard`} className="px-5 py-2.5 text-sm font-medium text-navy-900 border border-navy-900/20 hover:border-navy-900 transition-colors" style={{ borderColor: cliente.color_primario }}>
            Encuentra tu propiedad
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: cliente.color_primario }}>Portafolio privado</div>
          <h1 className="serif text-4xl md:text-6xl leading-tight mb-6">
            Propiedades de alto patrimonio, <span className="gold-gradient">seleccionadas para usted</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Responda unas preguntas y reciba al instante una selección curada que coincide con su perfil de inversión, presupuesto y objetivos.
          </p>
          <Link href={`/${slug}/wizard`} className="inline-block px-8 py-4 font-semibold text-navy-900 transition-opacity hover:opacity-90" style={{ background: cliente.color_primario }}>
            Comenzar mi búsqueda
          </Link>
        </div>
      </section>

      {/* Catálogo */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="serif text-3xl text-navy-900">Propiedades disponibles</h2>
            <span className="text-navy-900/50 text-sm">{inmuebles.length} inmuebles</span>
          </div>
          {inmuebles.length === 0 ? (
            <p className="text-navy-900/50">Catálogo en actualización. Contacte a su broker para opciones disponibles.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inmuebles.map((inm) => (
                <InmuebleCard key={inm.id} inm={inm} href={`/${slug}/inmueble/${inm.id}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-navy-900 text-white/50 py-8 text-center text-xs tracking-wider">
        © {new Date().getFullYear()} {cliente.nombre} · Portal privado de asesoría inmobiliaria
      </footer>
    </main>
  );
}
