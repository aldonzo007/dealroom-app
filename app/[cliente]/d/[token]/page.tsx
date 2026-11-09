import { notFound } from "next/navigation";
import Link from "next/link";
import { getCliente, getDealRoom, getInmueblesByIds, getInmueblesDestacados } from "@/lib/data";
import { formatMXN, tipoLabel, operacionLabel, Inmueble } from "@/lib/types";
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
  const nombreFull = dr.prospecto_nombre || "Estimado inversionista";
  const nombreCorto = nombreFull.split(" ")[0];
  const destacado = inmuebles[0];
  const otros = inmuebles.slice(1);

  const sinMatch = inmuebles.length === 0;
  const alternativas = sinMatch ? await getInmueblesDestacados(cliente.id, [], 6) : [];

  const primary = cliente.color_primario || "#C5A059";
  const broker = cliente.broker_nombre || "Su asesor asignado";
  const brokerTitulo = cliente.broker_titulo || "Real Estate Advisor";
  const brokerFoto = cliente.broker_foto_url;
  const whatsapp = (cliente.broker_whatsapp || "").replace(/\D/g, "");
  const waUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola ${broker}, soy ${nombreFull}. Me interesa platicar sobre las propiedades que me enviaste.`)}` : "";
  const calendarUrl = cliente.broker_calendar_url || cliente.calendar_url || "";

  const perfil = dr.perfil || {};
  const criterios: { label: string; value: string }[] = [];
  if (perfil.objetivo) criterios.push({ label: "Objetivo", value: perfil.objetivo.replace(/_/g, " ") });
  if (perfil.ciudades?.length) criterios.push({ label: "Zona", value: perfil.ciudades.join(", ") });
  if (perfil.presupuesto) criterios.push({ label: "Presupuesto", value: formatMXN(perfil.presupuesto) });
  if (perfil.tipo_buscado?.length) criterios.push({ label: "Tipo", value: perfil.tipo_buscado.map((t) => tipoLabel(t as never)).join(" / ") });

  return (
    <main className="bg-cream text-navy-900">
      <PortalTracker token={token} inmuebleId={destacado?.id} />

      {/* Top bar */}
      <nav className="bg-cream border-b border-navy-900/10 sticky top-0 z-30 backdrop-blur">
        <div className="container mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {cliente.logo_url ? (
              <img src={cliente.logo_url} alt={cliente.nombre} className="h-8" />
            ) : (
              <span className="serif text-xl font-semibold tracking-tight">{cliente.nombre}</span>
            )}
            <span className="hidden md:inline-block w-px h-5 bg-navy-900/15" />
            <span className="hidden md:inline-block text-xs tracking-[0.25em] uppercase text-navy-900/50 font-medium">Private Real Estate Portfolio</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="inline-flex items-center gap-2 border border-navy-900/15 bg-white rounded-full px-4 py-1.5 text-xs text-navy-900/70">
              <LockIcon /> Portafolio privado
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 border border-navy-900/15 bg-white rounded-full px-4 py-1.5 text-xs text-navy-900/70">
              <CheckIcon /> Preparado para ti
            </span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-navy-900/5">
        <div className="absolute inset-0">
          {destacado?.fotos[0] ? (
            <img src={destacado.fotos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cream to-navy-900/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-transparent to-cream/60" />
        </div>
        <div className="relative container mx-auto px-6 lg:px-10 pt-14 lg:pt-20 pb-14">
          <div className="text-[11px] tracking-[0.35em] uppercase text-navy-900/60 font-medium mb-7">
            DealRoom <span className="opacity-40 mx-2">|</span> Portafolio personalizado
          </div>
          <h1 className="serif text-[42px] md:text-6xl lg:text-7xl leading-[1.02] font-medium text-navy-900 max-w-3xl mb-8">
            {cliente.hero_frase || "Tu selección privada de inversión inmobiliaria"}
          </h1>
          <p className="text-navy-900/70 max-w-xl text-[15px] leading-relaxed mb-10">
            {nombreCorto}, preparamos este portafolio de oportunidades
            {perfil.ciudades?.length ? ` en ${perfil.ciudades.join(", ")}` : ""} con base en tu
            {perfil.objetivo ? ` objetivo de ${perfil.objetivo.replace(/_/g, " ")}, ` : " objetivo, "}
            presupuesto y tipo de activo preferido. Son propiedades con potencial de plusvalía, ingresos y solidez patrimonial.
          </p>
          {criterios.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {criterios.map((c) => (
                <div key={c.label} className="bg-white border border-navy-900/10 rounded-md px-5 py-3 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${primary}1a`, color: primary }}>
                    <BadgeIcon />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-navy-900/50 font-medium">{c.label}</div>
                    <div className="text-sm font-medium capitalize">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DESTACADO + ASESOR */}
      {destacado && (
        <section className="container mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Col izquierda: destacado + otros */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero property card */}
              <article className="bg-white rounded-xl border border-navy-900/10 overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-3 relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
                    {destacado.fotos[0] ? (
                      <img src={destacado.fotos[0]} alt={destacado.nombre_interno} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-navy-900/5 flex items-center justify-center text-navy-900/30 text-sm">Sin foto</div>
                    )}
                    <div className="absolute top-4 left-4 bg-navy-900/80 backdrop-blur text-white px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-medium">
                      Oportunidad destacada
                    </div>
                  </div>
                  <div className="md:col-span-2 p-7 lg:p-8 flex flex-col">
                    <h2 className="serif text-2xl lg:text-[28px] leading-tight mb-2 font-medium">{destacado.nombre_interno}</h2>
                    <div className="flex items-center gap-1.5 text-navy-900/60 text-sm mb-5">
                      <PinIcon />
                      <span>{[destacado.zona, destacado.ciudad].filter(Boolean).join(", ") || destacado.direccion || "Ubicación por confirmar"}</span>
                    </div>
                    <div className="serif text-3xl lg:text-4xl font-medium mb-1">
                      {destacado.operacion === "renta" ? `${formatMXN(destacado.precio_renta)}` : formatMXN(destacado.precio_venta)}
                      <span className="text-sm text-navy-900/50 font-sans font-normal ml-1">MXN{destacado.operacion === "renta" ? "/mes" : ""}</span>
                    </div>
                    <div className="h-px bg-navy-900/10 my-5" />
                    <div className="text-[10px] tracking-[0.25em] uppercase text-navy-900/50 font-medium mb-2">Por qué encaja con tu búsqueda</div>
                    <p className="text-navy-900/75 text-sm leading-relaxed mb-5 flex-1">
                      {destacado.descripcion
                        ? destacado.descripcion.slice(0, 220) + (destacado.descripcion.length > 220 ? "..." : "")
                        : `${tipoLabel(destacado.tipo)} en ${destacado.zona || destacado.ciudad || "zona estratégica"} con potencial de plusvalía, ocupación comprobada y métricas sólidas de inversión.`}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-navy-900/10">
                      {destacado.m2_terreno > 0 && <MiniMetric icon={<SquareIcon />} label="Sup. de terreno" value={`${destacado.m2_terreno.toLocaleString()} m²`} />}
                      {destacado.m2_construidos > 0 && <MiniMetric icon={<BuildIcon />} label="Sup. construida" value={`${destacado.m2_construidos.toLocaleString()} m²`} />}
                      {destacado.renta_promedio_m2 > 0 && <MiniMetric icon={<ChartIcon />} label="Renta estimada" value={`${formatMXN(destacado.renta_promedio_m2 * (destacado.m2_construidos || destacado.m2_terreno))} /mes`} />}
                      {destacado.plusvalia_anual > 0 && <MiniMetric icon={<TrendIcon />} label="Plusvalía anual" value={`${destacado.plusvalia_anual}%`} />}
                    </div>
                  </div>
                </div>
              </article>

              {/* Otras propiedades (si hay) */}
              {otros.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {otros.slice(0, 2).map((inm) => (
                    <SmallPropCard key={inm.id} inm={inm} slug={slug} />
                  ))}
                </div>
              )}
            </div>

            {/* Col derecha: asesor sticky */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-navy-900/10 p-7 lg:p-8 lg:sticky lg:top-24 shadow-sm">
                <div className="text-[10px] tracking-[0.3em] uppercase text-navy-900/50 font-medium text-center mb-5">Tu asesor</div>
                {brokerFoto ? (
                  <img src={brokerFoto} alt={broker} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-cream" />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ring-4 ring-cream" style={{ background: `${primary}15` }}>
                    <span className="serif text-3xl font-medium" style={{ color: primary }}>{broker.charAt(0)}</span>
                  </div>
                )}
                <h3 className="serif text-xl font-medium text-center mb-1 leading-tight">{broker}</h3>
                <div className="text-[10px] tracking-[0.3em] uppercase text-navy-900/50 font-medium text-center mb-5">{brokerTitulo}</div>
                <p className="text-sm text-navy-900/70 text-center leading-relaxed mb-6">
                  Te acompaño en la evaluación de estas oportunidades, coordinación de visitas y análisis financiero.
                </p>
                <div className="space-y-3">
                  {calendarUrl && (
                    <TrackedLink token={token} tipo="visita_agendada" inmuebleId={destacado.id} href={calendarUrl} external className="flex items-center justify-between w-full px-5 py-3.5 text-white font-medium text-sm rounded-md transition-opacity hover:opacity-90" style={{ background: primary }}>
                      <span className="flex items-center gap-2"><CalIcon /> Agendar visita</span>
                      <span>→</span>
                    </TrackedLink>
                  )}
                  {destacado.pdf_ficha && (
                    <TrackedLink token={token} tipo="pdf_descargado" inmuebleId={destacado.id} href={destacado.pdf_ficha} external className="flex items-center justify-between w-full px-5 py-3.5 bg-white border border-navy-900/15 text-navy-900 font-medium text-sm rounded-md hover:border-navy-900/30 transition-colors">
                      <span className="flex items-center gap-2"><DocIcon /> Solicitar documentación</span>
                      <span>→</span>
                    </TrackedLink>
                  )}
                  {waUrl && (
                    <TrackedLink token={token} tipo="whatsapp_click" inmuebleId={destacado.id} href={waUrl} external className="flex items-center justify-between w-full px-5 py-3.5 bg-white border border-navy-900/15 text-navy-900 font-medium text-sm rounded-md hover:border-navy-900/30 transition-colors">
                      <span className="flex items-center gap-2"><WAIcon /> Hablar con tu asesor</span>
                      <span>→</span>
                    </TrackedLink>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* RESUMEN EJECUTIVO (banda oscura) */}
      {destacado && (
        <section className="bg-navy-900 text-white">
          <div className="container mx-auto px-6 lg:px-10 py-14 lg:py-16">
            <div className="grid lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-2">
                <div className="text-[10px] tracking-[0.35em] uppercase font-medium mb-3" style={{ color: primary }}>Análisis de inversión</div>
                <h2 className="serif text-4xl lg:text-5xl font-medium mb-4 leading-tight">Resumen ejecutivo</h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-md">
                  Más que propiedades, te entregamos inteligencia de inversión: métricas clave, escenario de rentas, potencial de plusvalía y documentación lista para tu análisis.
                </p>
              </div>
              <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-5 gap-3">
                <KPI icon={<MoneyIcon />} label="Precio" value={destacado.operacion === "renta" ? formatMXN(destacado.precio_renta) : formatMXN(destacado.precio_venta)} sub="MXN" primary={primary} />
                <KPI icon={<SquareIcon />} label="Superficie" value={`${(destacado.m2_construidos || destacado.m2_terreno).toLocaleString()}`} sub="m²" primary={primary} />
                <KPI icon={<ChartIcon />} label="Renta est." value={destacado.renta_promedio_m2 > 0 ? formatMXN(destacado.renta_promedio_m2 * (destacado.m2_construidos || destacado.m2_terreno)) : "A estimar"} sub={destacado.renta_promedio_m2 > 0 ? "/ mes" : ""} primary={primary} />
                <KPI icon={<TrendIcon />} label="Plusvalía" value={destacado.plusvalia_anual > 0 ? `${destacado.plusvalia_anual}%` : "—"} sub="anual" primary={primary} />
                <KPI icon={<CheckIcon />} label="Estatus" value={destacado.estatus === "disponible" ? "Disponible" : destacado.estatus} sub="" primary={primary} badge />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CALCULADORA */}
      {destacado && destacado.precio_venta > 0 && (
        <Calculadora inm={destacado} token={token} />
      )}

      {/* DOCUMENTOS + UBICACIÓN */}
      {destacado && (
        <section className="container mx-auto px-6 lg:px-10 py-14 lg:py-16">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <h3 className="serif text-3xl font-medium mb-2">Documentos y recursos</h3>
              <p className="text-navy-900/60 text-sm mb-7">Toda la información clave para tu evaluación, en un solo lugar.</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <DocTile icon={<DocIcon />} label="Ficha técnica" href={destacado.pdf_ficha} action="↓" />
                <DocTile icon={<PlanIcon />} label="Plano" href={destacado.pdf_ficha} action="↓" />
                <DocTile icon={<LayerIcon />} label="Uso de suelo" href={null} action="↓" />
                <DocTile icon={<GalleryIcon />} label={`Galería${destacado.fotos.length ? ` (${destacado.fotos.length})` : ""}`} href={`/${slug}/inmueble/${destacado.id}`} action="→" />
                <DocTile icon={<PinIcon />} label="Ubicación" href={destacado.maps_link} action="→" />
              </div>

              <div className="mt-10">
                <h4 className="serif text-xl font-medium mb-4">Especificaciones</h4>
                <DatosFisicos inm={destacado} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h3 className="serif text-3xl font-medium mb-2">Ubicación</h3>
              <p className="text-navy-900/60 text-sm mb-7">Zona estratégica con alta demanda y conectividad.</p>
              <div className="bg-white border border-navy-900/10 rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-[4/3] bg-cream relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(10,22,40,.08) 0%, transparent 50%), linear-gradient(135deg, #f5f1e8 0%, #e8ddc5 100%)' }} />
                  <div className="relative text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white" style={{ background: primary }}>
                      <PinIcon />
                    </div>
                    <div className="text-xs font-medium text-navy-900/70">{[destacado.zona, destacado.ciudad].filter(Boolean).join(", ") || "CDMX"}</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-sm font-medium mb-1">{[destacado.zona, destacado.ciudad].filter(Boolean).join(", ") || "Ubicación"}</div>
                  <p className="text-xs text-navy-900/60 leading-relaxed mb-3">Zona consolidada con alta demanda, excelente conectividad y plusvalía sostenida.</p>
                  {destacado.maps_link && (
                    <a href={destacado.maps_link} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: primary }}>
                      Ver en mapa <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POR QUÉ SELECCIONAMOS */}
      {destacado && (
        <section className="bg-white border-y border-navy-900/5">
          <div className="container mx-auto px-6 lg:px-10 py-14 lg:py-16">
            <h3 className="serif text-3xl lg:text-4xl font-medium mb-2 leading-tight">Por qué seleccionamos estas propiedades para ti</h3>
            <p className="text-navy-900/60 text-sm mb-10 max-w-3xl">Este portafolio responde a los criterios definidos en nuestra conversación y está enfocado en generar valor real para tu estrategia patrimonial.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Pillar icon={<TargetIcon />} title="Alineadas a tu objetivo" desc="Activos con potencial de ingresos estables y apreciación." primary={primary} />
              <Pillar icon={<PinIcon />} title="Ubicaciones estratégicas" desc="Zonas con alta demanda, liquidez y plusvalía comprobada." primary={primary} />
              <Pillar icon={<ChartIcon />} title="Números que respaldan" desc="Rentas, yields y escenarios de crecimiento analizados." primary={primary} />
              <Pillar icon={<ShieldIcon />} title="Operación segura" desc="Acompañamiento integral en análisis, negociación y cierre." primary={primary} />
            </div>
          </div>
        </section>
      )}

      {/* Alternativas sin match */}
      {sinMatch && alternativas.length > 0 && (
        <section className="py-14 lg:py-16">
          <div className="container mx-auto px-6 lg:px-10">
            <div className="text-[10px] tracking-[0.3em] uppercase font-medium mb-3" style={{ color: primary }}>Mientras tanto</div>
            <h2 className="serif text-3xl lg:text-4xl font-medium mb-3">Explora otras oportunidades</h2>
            <p className="text-navy-900/60 mb-10 max-w-2xl text-sm leading-relaxed">
              {nombreCorto}, no encontramos coincidencias exactas con tu búsqueda, pero estas propiedades están disponibles en el portafolio actual y pueden darte una idea del tipo de inversión que gestionamos. Tu asesor te contactará con opciones a la medida en las próximas 24 horas.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativas.map((inm) => (
                <InmuebleCard key={inm.id} inm={inm} href={`/${slug}/inmueble/${inm.id}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL con imagen de fondo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {destacado?.fotos[0] ? (
            <img src={destacado.fotos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-navy-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/90 to-navy-900/70" />
        </div>
        <div className="relative container mx-auto px-6 lg:px-10 py-20 lg:py-24 text-center text-white">
          <h2 className="serif text-4xl md:text-5xl font-medium mb-5 leading-tight">¿Listo para dar el siguiente paso?</h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-[15px]">
            Coordinemos una visita, revisemos a detalle la documentación o conversemos sobre la estrategia que mejor se ajuste a tus objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {calendarUrl && (
              <TrackedLink token={token} tipo="visita_agendada" inmuebleId={destacado?.id} href={calendarUrl} external className="inline-flex items-center gap-2 px-7 py-4 font-semibold text-white rounded-md text-sm transition-opacity hover:opacity-90" style={{ background: primary }}>
                <CalIcon /> Agendar visita
              </TrackedLink>
            )}
            {destacado?.pdf_ficha && (
              <TrackedLink token={token} tipo="pdf_descargado" inmuebleId={destacado.id} href={destacado.pdf_ficha} external className="inline-flex items-center gap-2 px-7 py-4 font-semibold text-white border border-white/25 rounded-md text-sm hover:bg-white/5 transition-colors">
                <DocIcon /> Solicitar documentación
              </TrackedLink>
            )}
            {waUrl && (
              <TrackedLink token={token} tipo="whatsapp_click" inmuebleId={destacado?.id} href={waUrl} external className="inline-flex items-center gap-2 px-7 py-4 font-semibold text-white border border-white/25 rounded-md text-sm hover:bg-white/5 transition-colors">
                <WAIcon /> Hablar por WhatsApp
              </TrackedLink>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white/40 py-7 text-center text-[11px] tracking-[0.15em] border-t border-white/5">
        © {new Date().getFullYear()} {cliente.nombre} · Portafolio privado · Estimaciones sujetas a dictamen legal y validación notarial
      </footer>
    </main>
  );
}

/* ---------- Subcomponentes ---------- */

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-navy-900/40 mt-0.5">{icon}</div>
      <div>
        <div className="text-[10px] tracking-[0.15em] uppercase text-navy-900/50">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, sub, primary, badge }: { icon: React.ReactNode; label: string; value: string; sub: string; primary: string; badge?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="w-8 h-8 rounded flex items-center justify-center mb-3" style={{ background: `${primary}22`, color: primary }}>
        {icon}
      </div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium mb-1">{label}</div>
      {badge ? (
        <span className="inline-block text-xs font-medium px-2 py-1 rounded" style={{ background: `${primary}22`, color: primary }}>{value}</span>
      ) : (
        <>
          <div className="serif text-xl lg:text-2xl font-medium leading-tight">{value}</div>
          {sub && <div className="text-[11px] text-white/50 mt-0.5">{sub}</div>}
        </>
      )}
    </div>
  );
}

function DocTile({ icon, label, href, action }: { icon: React.ReactNode; label: string; href: string | null; action: string }) {
  const content = (
    <div className={`group bg-white border border-navy-900/10 rounded-lg p-4 flex flex-col justify-between h-full transition-colors ${href ? "hover:border-navy-900/30 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
      <div className="w-9 h-9 rounded bg-cream flex items-center justify-center text-navy-900/70 mb-5">{icon}</div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-sm font-medium leading-tight">{label}</div>
        <span className="text-navy-900/40 text-sm">{href ? action : ""}</span>
      </div>
    </div>
  );
  if (!href) return content;
  const isExternal = href.startsWith("http") || href.startsWith("/");
  return isExternal ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="block">{content}</a> : <Link href={href} className="block">{content}</Link>;
}

function Pillar({ icon, title, desc, primary }: { icon: React.ReactNode; title: string; desc: string; primary: string }) {
  return (
    <div>
      <div className="w-10 h-10 rounded flex items-center justify-center mb-4" style={{ background: `${primary}1a`, color: primary }}>{icon}</div>
      <h4 className="font-semibold text-[15px] mb-2 leading-tight">{title}</h4>
      <p className="text-navy-900/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function SmallPropCard({ inm, slug }: { inm: Inmueble; slug: string }) {
  const precio = inm.operacion === "renta" ? `${formatMXN(inm.precio_renta)}/mes` : formatMXN(inm.precio_venta);
  return (
    <Link href={`/${slug}/inmueble/${inm.id}`} className="group bg-white rounded-xl border border-navy-900/10 overflow-hidden flex shadow-sm hover:border-navy-900/30 transition-colors">
      <div className="w-32 flex-shrink-0 relative">
        {inm.fotos[0] ? (
          <img src={inm.fotos[0]} alt={inm.nombre_interno} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-navy-900/5" />
        )}
      </div>
      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h4 className="serif text-base font-medium leading-tight truncate mb-1">{inm.nombre_interno}</h4>
          <div className="flex items-center gap-1 text-xs text-navy-900/50 mb-2">
            <PinIcon /> <span className="truncate">{[inm.zona, inm.ciudad].filter(Boolean).join(", ") || "—"}</span>
          </div>
          <div className="serif text-lg font-medium">{precio}</div>
        </div>
        {inm.descripcion && <p className="text-xs text-navy-900/60 leading-snug line-clamp-2 mt-2">{inm.descripcion}</p>}
      </div>
    </Link>
  );
}

/* ---------- Iconos (SVG inline) ---------- */

function LockIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
}
function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>;
}
function BadgeIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8 12l2 2 6-6" /></svg>;
}
function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function SquareIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>;
}
function BuildIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" /></svg>;
}
function ChartIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20h18M7 20V10M12 20V4M17 20v-6" /></svg>;
}
function TrendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 7-7M14 8h7v7" /></svg>;
}
function MoneyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-5 1.5-5 3a2.5 2.5 0 0 0 5 0" /></svg>;
}
function CalIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function DocIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>;
}
function WAIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.3 0 1.4 1 2.7 1.2 2.9.1.2 2 3 4.7 4.1 1.1.5 2 .7 2.6.8.6.1 1.2.1 1.6 0 .5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5-1.3c1.4.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.7 3.5 13.4 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5S16.7 20.5 12 20.5z" /></svg>;
}
function PlanIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>;
}
function LayerIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l10 5-10 5L2 7l10-5zM2 12l10 5 10-5M2 17l10 5 10-5" /></svg>;
}
function GalleryIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>;
}
function TargetIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" /><path d="M9 12l2 2 4-4" /></svg>;
}
