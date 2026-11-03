import Link from "next/link";
import { notFound } from "next/navigation";
import { getCliente, getInmueble } from "@/lib/data";
import { formatMXN, tipoLabel, operacionLabel } from "@/lib/types";
import Gallery from "@/components/Gallery";
import DatosFisicos from "@/components/DatosFisicos";
import Calculadora from "@/components/Calculadora";

export default async function FichaInmueble({ params }: { params: Promise<{ cliente: string; id: string }> }) {
  const { cliente: slug, id } = await params;
  const cliente = await getCliente(slug);
  if (!cliente) notFound();
  const inm = await getInmueble(id);
  if (!inm || inm.client_id !== cliente.id) notFound();

  const precio = inm.operacion === "renta" ? `${formatMXN(inm.precio_renta)}/mes` : formatMXN(inm.precio_venta);
  const precioPorM2 = inm.m2_terreno > 0 && inm.precio_venta > 0 ? Math.round(inm.precio_venta / inm.m2_terreno) : 0;

  return (
    <main className="min-h-screen bg-cream">
      <nav className="border-b border-navy-900/10 py-5">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href={`/${slug}`} className="serif text-lg text-navy-900">{cliente.nombre}</Link>
          <Link href={`/${slug}/wizard`} className="px-5 py-2.5 text-sm font-medium text-navy-900 border border-navy-900/20 hover:border-navy-900 transition-colors">
            Encuentra tu propiedad
          </Link>
        </div>
      </nav>

      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <Link href={`/${slug}`} className="text-navy-900/50 text-sm hover:text-navy-900 mb-8 inline-block">← Volver al catálogo</Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
            <Gallery fotos={inm.fotos} />
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-navy-900 text-gold px-4 py-1.5 text-xs tracking-[0.2em] uppercase">{tipoLabel(inm.tipo)}</span>
                  <span className="border border-gold text-gold-dark px-4 py-1.5 text-xs tracking-[0.2em] uppercase">{operacionLabel(inm.operacion)}</span>
                </div>
                <h1 className="serif text-4xl md:text-5xl text-navy-900 mb-3 leading-tight">{inm.nombre_interno}</h1>
                {inm.direccion && <p className="text-navy-900/60">{inm.direccion}</p>}
              </div>

              <div className="border-l-2 border-gold pl-6">
                <div className="text-xs tracking-[0.3em] text-navy-900/50 uppercase mb-2">{inm.operacion === "renta" ? "Renta mensual" : "Precio de adquisición"}</div>
                <div className="serif text-5xl text-navy-900 font-medium">{precio}</div>
                {precioPorM2 > 0 && <div className="text-navy-900/60 text-sm mt-2">{formatMXN(precioPorM2)} por m²</div>}
              </div>

              <div className="space-y-3">
                {inm.pdf_ficha && <DocLink href={inm.pdf_ficha} label="Descargar ficha técnica (PDF)" />}
                {inm.video_tour && <DocLink href={inm.video_tour} label="Ver recorrido virtual" />}
                {inm.maps_link && <DocLink href={inm.maps_link} label="Ver ubicación en el mapa" />}
              </div>

              <Link href={`/${slug}/wizard`} className="block text-center bg-gold text-navy-900 px-8 py-4 font-semibold tracking-wide hover:bg-gold-light transition-colors">
                Ver si coincide con mi perfil
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-xs tracking-[0.3em] text-gold uppercase mb-6">Especificaciones</div>
            <DatosFisicos inm={inm} />
          </div>
        </div>
      </section>

      <Calculadora inm={inm} />
    </main>
  );
}

function DocLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="flex items-center justify-between w-full border border-navy-900/20 px-6 py-4 hover:border-navy-900 transition-colors group">
      <span className="text-navy-900 font-medium">{label}</span>
      <span className="text-gold group-hover:translate-x-1 transition-transform">→</span>
    </a>
  );
}
