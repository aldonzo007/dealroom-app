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
  const primary = cliente.color_primario || "#C5A059";
  const broker = cliente.broker_nombre;
  const brokerFoto = cliente.broker_foto_url;

  return (
    <main className="min-h-screen bg-cream text-navy-900">
      {/* Nav */}
      <nav className="border-b border-navy-900/10 bg-cream/95 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {cliente.logo_url ? (
              <img src={cliente.logo_url} alt={cliente.nombre} className="h-8" />
            ) : (
              <Link href={`/${slug}`} className="serif text-xl font-semibold tracking-tight">{cliente.nombre}</Link>
            )}
            <span className="hidden md:inline-block w-px h-5 bg-navy-900/15" />
            <Link href={`/${slug}`} className="hidden md:inline-block text-xs tracking-[0.25em] uppercase text-navy-900/50 font-medium hover:text-navy-900">Portafolio</Link>
          </div>
          <Link href={`/${slug}/wizard`} className="px-5 py-2.5 text-sm font-semibold text-white rounded-md transition-opacity hover:opacity-90" style={{ background: primary }}>
            Ver si coincide con mi perfil
          </Link>
        </div>
      </nav>

      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-6 lg:px-10">
          <Link href={`/${slug}`} className="text-navy-900/50 text-sm hover:text-navy-900 mb-6 inline-block">← Volver al catálogo</Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Izq: galería + specs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-navy-900/10 overflow-hidden shadow-sm">
                <div className="relative">
                  <Gallery fotos={inm.fotos} />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-navy-900/80 backdrop-blur text-white px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-medium">{tipoLabel(inm.tipo)}</span>
                    <span className="bg-white/90 backdrop-blur text-navy-900 px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-medium">{operacionLabel(inm.operacion)}</span>
                  </div>
                </div>
                <div className="p-7 lg:p-8">
                  <h1 className="serif text-3xl md:text-4xl font-medium mb-2 leading-tight">{inm.nombre_interno}</h1>
                  {inm.direccion && (
                    <div className="flex items-center gap-1.5 text-navy-900/60 text-sm mb-6">
                      <PinIcon /><span>{inm.direccion}</span>
                    </div>
                  )}
                  <div className="flex items-end gap-6 mb-6 pb-6 border-b border-navy-900/10">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] uppercase text-navy-900/50 font-medium mb-1">{inm.operacion === "renta" ? "Renta mensual" : "Precio"}</div>
                      <div className="serif text-4xl lg:text-5xl font-medium leading-none">{precio}</div>
                    </div>
                    {precioPorM2 > 0 && (
                      <div className="text-sm text-navy-900/60 pb-1.5">{formatMXN(precioPorM2)} / m²</div>
                    )}
                  </div>

                  {inm.descripcion && (
                    <div className="mb-6">
                      <div className="text-[10px] tracking-[0.3em] uppercase font-medium mb-3" style={{ color: primary }}>Detalles del inmueble</div>
                      <div className="text-navy-900/80 text-sm leading-relaxed whitespace-pre-wrap">{inm.descripcion}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: primary }}>Especificaciones</div>
                    <DatosFisicos inm={inm} />
                  </div>
                </div>
              </div>
            </div>

            {/* Der: asesor + docs */}
            <aside className="lg:col-span-1 space-y-4">
              {broker && (
                <div className="bg-white rounded-xl border border-navy-900/10 p-7 shadow-sm">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-navy-900/50 font-medium text-center mb-4">Tu asesor</div>
                  {brokerFoto ? (
                    <img src={brokerFoto} alt={broker} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-cream" />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center ring-4 ring-cream" style={{ background: `${primary}15` }}>
                      <span className="serif text-2xl font-medium" style={{ color: primary }}>{broker.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="serif text-lg font-medium text-center mb-5">{broker}</h3>
                  <div className="space-y-2">
                    {(cliente.broker_calendar_url || cliente.calendar_url) && (
                      <a href={cliente.broker_calendar_url || cliente.calendar_url || "#"} target="_blank" rel="noopener" className="flex items-center justify-between w-full px-4 py-3 text-white font-medium text-sm rounded-md hover:opacity-90 transition-opacity" style={{ background: primary }}>
                        <span>Agendar visita</span><span>→</span>
                      </a>
                    )}
                    {cliente.broker_whatsapp && (
                      <a href={`https://wa.me/${cliente.broker_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="flex items-center justify-between w-full px-4 py-3 border border-navy-900/15 font-medium text-sm rounded-md hover:border-navy-900/30 transition-colors">
                        <span>WhatsApp directo</span><span>→</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-navy-900/10 p-6 shadow-sm">
                <div className="text-[10px] tracking-[0.3em] uppercase text-navy-900/50 font-medium mb-4">Documentos</div>
                <div className="space-y-2">
                  {inm.pdf_ficha && <DocLink href={inm.pdf_ficha} label="Ficha técnica (PDF)" external primary={primary} />}
                  {inm.video_tour && <DocLink href={inm.video_tour} label="Recorrido virtual" external primary={primary} />}
                  {inm.maps_link && <DocLink href={inm.maps_link} label="Ver en mapa" external primary={primary} />}
                  {!inm.pdf_ficha && !inm.video_tour && !inm.maps_link && (
                    <p className="text-xs text-navy-900/50">Documentos disponibles bajo solicitud con tu asesor.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {inm.precio_venta > 0 && <Calculadora inm={inm} />}

      <footer className="bg-navy-900 text-white/40 py-7 text-center text-[11px] tracking-[0.15em] mt-10">
        © {new Date().getFullYear()} {cliente.nombre} · Portafolio privado
      </footer>
    </main>
  );
}

function DocLink({ href, label, primary }: { href: string; label: string; external?: boolean; primary: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="flex items-center justify-between w-full px-3 py-2.5 text-sm hover:bg-cream rounded transition-colors group">
      <span className="text-navy-900 font-medium">{label}</span>
      <span style={{ color: primary }} className="group-hover:translate-x-1 transition-transform">→</span>
    </a>
  );
}

function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
