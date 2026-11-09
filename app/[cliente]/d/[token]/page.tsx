import { notFound } from "next/navigation";
import { getCliente, getDealRoom, getInmueblesByIds, getInmueblesDestacados } from "@/lib/data";
import { formatMXN, tipoLabel, operacionLabel } from "@/lib/types";
import Gallery from "@/components/Gallery";
import DatosFisicos from "@/components/DatosFisicos";
import Calculadora from "@/components/Calculadora";
import InmuebleCard from "@/components/InmuebleCard";
import { PortalTracker, TrackedLink } from "@/components/Trackers";

export default async function DealRoomPage({ params }: { params: Promise<{ cliente: string; token: string }> }) {
  const { cliente: slug, token } = await params;
  const cliente = await getCliente(slug);
  if (!cliente) notFound();
  const dr = await getDealRoom(token);
  if (!dr || dr.client_id !== cliente.id) notFound();

  const inmuebles = await getInmueblesByIds(dr.inmueble_ids);
  const nombre = dr.prospecto_nombre || "Estimado inversionista";
  const destacado = inmuebles[0];
  const otros = inmuebles.slice(1);

  // Si no hubo match (deal room sin inmuebles), traemos opciones destacadas del catálogo
  const sinMatch = inmuebles.length === 0;
  const alternativas = sinMatch ? await getInmueblesDestacados(cliente.id, [], 6) : [];

  const broker = destacado?.broker_nombre || cliente.broker_nombre || "Su broker asignado";
  const whatsapp = (destacado?.broker_whatsapp || cliente.broker_whatsapp || "").replace(/\D/g, "");
  const waUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, soy ${nombre}. Me interesa agendar visita.`)}` : "";

  return (
    <main className="bg-cream">
      <PortalTracker token={token} inmuebleId={destacado?.id} />

      {/* Hero */}
      <section className="relative bg-navy-900 text-white py-20 lg:py-28 overflow-hidden">
        {destacado?.fotos[0] && (
          <>
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${destacado.fotos[0]})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-transparent" />
          </>
        )}
        <div className="relative container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: cliente.color_primario }}>Selección privada</div>
          <h1 className="serif text-4xl md:text-6xl leading-tight mb-6">
            {inmuebles.length > 0 ? <>Encontramos su <span className="gold-gradient">selección ideal</span>, {nombre}</> : <>Gracias, {nombre}</>}
          </h1>
          <p className="text-white/70 text-lg">
            {inmuebles.length > 0
              ? `Preparamos ${inmuebles.length} ${inmuebles.length === 1 ? "propiedad que coincide" : "propiedades que coinciden"} con su perfil. Revise, analice el retorno y agende su visita.`
              : "No encontramos coincidencias exactas por ahora. Su broker le contactará con opciones a la medida en las próximas 24 horas."}
          </p>
        </div>
      </section>

      {destacado && (
        <>
          {/* Inmueble destacado */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-xs tracking-[0.3em] text-gold uppercase mb-6">Su mejor coincidencia</div>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-12">
                <Gallery fotos={destacado.fotos} />
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-navy-900 text-gold px-4 py-1.5 text-xs tracking-[0.2em] uppercase">{tipoLabel(destacado.tipo)}</span>
                      <span className="border border-gold text-gold-dark px-4 py-1.5 text-xs tracking-[0.2em] uppercase">{operacionLabel(destacado.operacion)}</span>
                    </div>
                    <h2 className="serif text-4xl text-navy-900 mb-3 leading-tight">{destacado.nombre_interno}</h2>
                    {destacado.direccion && <p className="text-navy-900/60">{destacado.direccion}</p>}
                  </div>
                  <div className="border-l-2 border-gold pl-6">
                    <div className="text-xs tracking-[0.3em] text-navy-900/50 uppercase mb-2">{destacado.operacion === "renta" ? "Renta mensual" : "Precio de adquisición"}</div>
                    <div className="serif text-5xl text-navy-900 font-medium">
                      {destacado.operacion === "renta" ? `${formatMXN(destacado.precio_renta)}/mes` : formatMXN(destacado.precio_venta)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {destacado.pdf_ficha && (
                      <TrackedLink token={token} tipo="pdf_descargado" inmuebleId={destacado.id} href={destacado.pdf_ficha} external className="flex items-center justify-between w-full border border-navy-900/20 px-6 py-4 hover:border-navy-900 transition-colors group">
                        <span className="text-navy-900 font-medium">Descargar ficha técnica (PDF)</span>
                        <span className="text-gold">→</span>
                      </TrackedLink>
                    )}
                    {destacado.maps_link && (
                      <a href={destacado.maps_link} target="_blank" rel="noopener" className="flex items-center justify-between w-full border border-navy-900/20 px-6 py-4 hover:border-navy-900 transition-colors">
                        <span className="text-navy-900 font-medium">Ver ubicación en el mapa</span>
                        <span className="text-gold">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {destacado.descripcion && (
                <div className="mb-12">
                  <div className="text-xs tracking-[0.3em] text-gold uppercase mb-6">Detalles del inmueble</div>
                  <div className="prose max-w-3xl text-navy-900/80 leading-relaxed whitespace-pre-wrap">
                    {destacado.descripcion}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs tracking-[0.3em] text-gold uppercase mb-6">Especificaciones</div>
                <DatosFisicos inm={destacado} />
              </div>
            </div>
          </section>

          <Calculadora inm={destacado} token={token} />
        </>
      )}

      {/* Otras opciones (tras el match) */}
      {otros.length > 0 && (
        <section className="py-16 lg:py-24 bg-cream">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-xs tracking-[0.3em] text-gold uppercase mb-2">Cartera complementaria</div>
            <h2 className="serif text-3xl text-navy-900 mb-10">Otras opciones para usted</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otros.map((inm) => (
                <InmuebleCard key={inm.id} inm={inm} href={`/${slug}/inmueble/${inm.id}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Si no hubo match, mostramos el catálogo destacado */}
      {sinMatch && alternativas.length > 0 && (
        <section className="py-16 lg:py-24 bg-cream">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-xs tracking-[0.3em] text-gold uppercase mb-2">Mientras tanto</div>
            <h2 className="serif text-3xl text-navy-900 mb-3">Explore otras oportunidades</h2>
            <p className="text-navy-900/60 mb-10 max-w-2xl">Estas propiedades están disponibles en nuestro portafolio actual. Pueden darle una idea del tipo de inversión que gestionamos mientras le preparamos su selección a la medida.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativas.map((inm) => (
                <InmuebleCard key={inm.id} inm={inm} href={`/${slug}/inmueble/${inm.id}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Agendar */}
      <section className="py-20 lg:py-28 bg-navy-900 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-6">El siguiente paso</div>
          <h2 className="serif text-4xl md:text-5xl mb-6">Momento de <span className="gold-gradient">avanzar</span></h2>
          <p className="text-white/70 text-lg mb-10">Reserve un espacio para visitar de manera privada y confidencial con su broker.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {cliente.calendar_url && (
              <TrackedLink token={token} tipo="visita_agendada" inmuebleId={destacado?.id} href={cliente.calendar_url} external className="inline-block bg-gold text-navy-900 px-10 py-4 font-semibold tracking-wide hover:bg-gold-light transition-colors">
                Agendar visita
              </TrackedLink>
            )}
            {waUrl && (
              <TrackedLink token={token} tipo="whatsapp_click" inmuebleId={destacado?.id} href={waUrl} external className="inline-block border border-gold/50 text-gold px-10 py-4 font-semibold tracking-wide hover:bg-gold/10 transition-colors">
                WhatsApp directo
              </TrackedLink>
            )}
          </div>
        </div>
      </section>

      {/* Broker */}
      <section className="py-14 bg-navy-800 text-white text-center">
        <div className="container mx-auto px-6 max-w-xl">
          <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold mx-auto mb-4 flex items-center justify-center">
            <span className="serif text-xl text-gold">{broker.charAt(0)}</span>
          </div>
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-2">Su broker asignado</div>
          <h3 className="serif text-2xl mb-2">{broker}</h3>
          <p className="text-white/60 text-sm">Especializado en operaciones de alto patrimonio. Atención directa y confidencial.</p>
        </div>
      </section>

      <footer className="bg-navy-900 text-white/40 py-6 text-center text-xs tracking-wider border-t border-white/10">
        © {new Date().getFullYear()} {cliente.nombre} · Portal privado · Estimaciones sujetas a dictamen legal y validación notarial
      </footer>
    </main>
  );
}
