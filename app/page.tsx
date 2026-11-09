import Link from "next/link";

const CALENDAR = "https://api.leadconnectorhq.com/widget/bookings/conoce-geekify";
const DEMO = "/demo/wizard";

// Mockup reutilizable del DealRoom (igual que en el hero)
function DealRoomMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl border border-forest-100 overflow-hidden">
        <div className="bg-forest-50 px-5 py-3 flex items-center gap-2 border-b border-forest-100">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-forest-800/50">dealroom.mx/portafolio</span>
        </div>
        <div className="p-6">
          <div className="text-xs tracking-wider text-forest-600 uppercase mb-2">Portafolio privado</div>
          <div className="serif text-2xl text-forest-800 mb-4">Hola, Jaime.</div>
          <div className="text-sm text-forest-800/70 mb-4">Aquí tienes una selección de oportunidades de inversión en CDMX, de acuerdo a tu interés.</div>
          <div className="flex gap-2 mb-4 text-xs flex-wrap">
            <span className="px-2 py-1 bg-forest-50 text-forest-700 rounded">Inversión</span>
            <span className="px-2 py-1 bg-forest-50 text-forest-700 rounded">$20-35M</span>
            <span className="px-2 py-1 bg-forest-50 text-forest-700 rounded">CDMX</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded overflow-hidden">
              <img src="/landing/mockup-1.jpg" alt="Edificio comercial" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded overflow-hidden">
              <img src="/landing/mockup-2.jpg" alt="Residencial de lujo" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded overflow-hidden">
              <img src="/landing/mockup-3.jpg" alt="Terreno de inversión" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {!compact && (
        <div className="absolute -bottom-6 -right-4 w-56 bg-white rounded-xl shadow-xl border border-forest-100 p-4 hidden md:block">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center text-xs font-bold">DR</div>
            <span className="text-xs font-medium text-forest-800">Agente IA</span>
          </div>
          <div className="text-xs text-forest-800/70 bg-forest-50 rounded-lg p-2 mb-2">¿Qué tipo de inmueble estás buscando?</div>
          <div className="text-xs bg-forest-600 text-white rounded-lg p-2 ml-6">Un edificio para inversión, CDMX, 20 a 35M</div>
          <div className="text-xs text-forest-800/70 bg-forest-50 rounded-lg p-2 mt-2">Perfecto. Te preparo tu selección personalizada ahora.</div>
        </div>
      )}
    </div>
  );
}

export default function LandingDealRoom() {
  return (
    <main className="bg-white text-forest-800">
      {/* NAV */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-forest-100">
        <div className="container mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border-2 border-forest-600 rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-forest-600 -rotate-45" />
            </div>
            <span className="serif text-xl text-forest-800 tracking-tight">DealRoom</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-forest-800/80">
            <a href="#como-funciona" className="hover:text-forest-600">Cómo funciona</a>
            <a href="#plataforma" className="hover:text-forest-600">La plataforma</a>
            <a href="#resultados" className="hover:text-forest-600">Resultados</a>
            <a href="#para-quien" className="hover:text-forest-600">Para quién es</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href={DEMO} className="hidden sm:inline-block px-4 py-2 text-sm font-medium border border-forest-600 text-forest-700 rounded hover:bg-forest-50">
              Probar demo
            </Link>
            <a href={CALENDAR} target="_blank" rel="noopener" className="px-4 py-2 text-sm font-medium bg-forest-600 text-white rounded hover:bg-forest-700">
              Agendar demo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO con imagen de fondo */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-50 to-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url(/landing/cta-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,122,78,0.08),transparent_50%)]" />

        <div className="relative container mx-auto px-6 lg:px-12 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block text-xs tracking-[0.2em] uppercase text-forest-600 font-medium mb-5 bg-forest-100 px-3 py-1.5 rounded">
              SISTEMA COMERCIAL CON IA PARA INMOBILIARIAS Y DESARROLLADORAS
            </div>
            <h1 className="serif text-4xl md:text-5xl lg:text-6xl text-forest-800 leading-[1.1] mb-6 font-semibold">
              Deja de perder oportunidades entre el <span className="text-forest-600">primer contacto</span> y la visita.
            </h1>
            <p className="text-forest-800/70 text-lg leading-relaxed mb-8 max-w-xl">
              Convierte el interés de tus prospectos en ventas con un sistema que combina Agente IA, portales personalizados (DealRoom) y un CRM diseñado para bienes raíces de alto valor.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={CALENDAR} target="_blank" rel="noopener" className="px-6 py-3.5 bg-forest-600 text-white font-medium rounded hover:bg-forest-700 flex items-center gap-2">
                <span>📅</span> Agendar una demo privada
              </a>
              <Link href={DEMO} className="px-6 py-3.5 border border-forest-600 text-forest-700 font-medium rounded hover:bg-forest-50 flex items-center gap-2">
                <span>▶</span> Probar el demo en vivo
              </Link>
            </div>
            {/* confianza */}
            <div className="mt-10 flex items-center gap-4 text-xs text-forest-800/50">
              <span>Usado con operaciones de</span>
              <span className="font-semibold text-forest-800">$20M a $200M MXN</span>
              <span>·</span>
              <span>Setup white-glove</span>
            </div>
          </div>
          <DealRoomMockup />
        </div>
      </section>

      {/* EL PROBLEMA con imagen lateral */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-forest-100 shadow-xl">
              <img src="/landing/problema.png" alt="Broker saturado con fichas, post-its y seguimientos manuales" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <div className="text-xs tracking-wider uppercase text-forest-600 mb-3">El reto de hoy</div>
            <h2 className="serif text-3xl md:text-4xl text-forest-800 font-semibold mb-6">La ficha que envías es la última vez que ves al prospecto.</h2>
            <p className="text-forest-800/70 mb-8">Un PDF, unas fotos, un WhatsApp y a esperar. Mientras tanto no sabes si abrió la propuesta, si la compartió, o si ya está viendo otra opción. La mayoría de los deals se enfrían aquí, no en la negociación.</p>
            <div className="space-y-4">
              {[
                { icon: "💬", title: "Interés que se enfría", desc: "Prospectos que piden información y después dejan de responder." },
                { icon: "📄", title: "Información dispersa", desc: "Fichas en PDF, fotos sueltas y datos incompletos." },
                { icon: "⏱", title: "Seguimiento manual", desc: "Conversaciones, recordatorios y tareas sin un proceso claro." },
                { icon: "👥", title: "Poca visibilidad", desc: "Es difícil saber qué prospectos están realmente interesados y en qué etapa van." },
              ].map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">{p.icon}</div>
                  <div>
                    <div className="font-semibold text-forest-800 mb-0.5">{p.title}</div>
                    <div className="text-sm text-forest-800/70">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="py-14 bg-forest-50/50 border-y border-forest-100">
        <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-10 text-center md:text-left">
          <Metric n="76%" l="de profesionales utiliza un CRM" />
          <Metric n="43%" l="reporta ventas en 3 a 6 meses" />
          <Metric n="81%" l="de compradores valora las fotografías como clave" />
        </div>
      </section>

      {/* SOLUCIÓN */}
      <section id="plataforma" className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-14">
            <div className="text-xs tracking-wider uppercase text-forest-600 mb-3">La solución</div>
            <h2 className="serif text-3xl md:text-4xl text-forest-800 font-semibold">Un sistema completo para generar más visitas, mejor seguimiento y más cierres.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🤖", title: "Agente IA inmobiliario", desc: "Atiende, responde y califica prospectos 24/7 por web, WhatsApp y otros canales." },
              { icon: "🏛", title: "DealRoom personalizado", desc: "Un portal privado por cada prospecto, con propiedades seleccionadas, análisis y siguiente paso comercial." },
              { icon: "📊", title: "CRM y automatización", desc: "Gestiona tu pipeline, seguimientos, visitas y tareas en un solo sistema con recordatorios y workflows automatizados." },
              { icon: "💻", title: "Micrositio inmobiliario", desc: "Presenta tu inventario con tu propia marca, capta leads y conéctalo con tu proceso de ventas." },
            ].map((p) => (
              <div key={p.title} className="border border-forest-100 rounded-xl p-6 hover:border-forest-600 transition-colors">
                <div className="text-2xl mb-3">{p.icon}</div>
                <div className="font-semibold text-forest-800 mb-2">{p.title}</div>
                <div className="text-sm text-forest-800/70">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEALROOM FEATURE (ahora con el mockup grande igual al hero) */}
      <section id="resultados" className="py-20 bg-forest-50/40">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1">
            <DealRoomMockup compact />
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-xs tracking-wider uppercase text-forest-600 mb-3">DealRoom</div>
            <h2 className="serif text-3xl md:text-4xl text-forest-800 font-semibold mb-6">Más que una ficha. Una experiencia de inversión.</h2>
            <p className="text-forest-800/70 mb-6">Cada prospecto recibe su propio portafolio privado, con las propiedades que realmente le encajan y todo lo que necesita para avanzar al cierre.</p>
            <ul className="space-y-3 text-forest-800/80">
              {[
                "Propiedades que realmente encajan con tu búsqueda.",
                "Fotografías, planos y documentación relevante.",
                "Análisis de inversión (rentas, ocupación, potencial).",
                "Calculadoras (ROI, crédito y gastos de escrituración).",
                "Solicitud de visitas y contacto directo con tu asesor.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="text-forest-600 mt-1">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-xs text-forest-800/50">*Disponibles según la información de cada inmueble.</div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-14">
            <div className="text-xs tracking-wider uppercase text-forest-600 mb-3">Cómo funciona</div>
            <h2 className="serif text-3xl md:text-4xl text-forest-800 font-semibold">Del primer contacto a una oportunidad real.</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-5">
            {[
              { n: 1, t: "Llega el prospecto", d: "Desde tu sitio, campañas, WhatsApp o referidos." },
              { n: 2, t: "Conocemos sus necesidades", d: "Nuestro Agente IA califica y recopila los criterios clave." },
              { n: 3, t: "Generamos su DealRoom", d: "Con una selección personalizada de propiedades." },
              { n: 4, t: "Avanza la conversación", d: "Solicita información, documentos o una visita." },
              { n: 5, t: "Todo en tu CRM", d: "Seguimiento, tareas, pipeline y resultados medibles." },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="w-10 h-10 rounded-full bg-forest-600 text-white flex items-center justify-center font-semibold mb-3">{s.n}</div>
                <div className="font-semibold text-forest-800 mb-1 text-sm">{s.t}</div>
                <div className="text-sm text-forest-800/70">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUIÉN (con imagen por categoría) */}
      <section id="para-quien" className="py-20 bg-forest-50/40">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <div className="text-xs tracking-wider uppercase text-forest-600 mb-3">Para quién es</div>
            <h2 className="serif text-3xl md:text-4xl text-forest-800 font-semibold">Diseñado para operaciones de alto valor.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { t: "Naves y bodegas", s: "Renta y venta industrial.", img: "/landing/naves.jpg" },
              { t: "Residencial de lujo", s: "Casas y departamentos premium.", img: "/landing/residencial.jpg" },
              { t: "Terrenos", s: "Inversión y desarrollo.", img: "/landing/terrenos.jpg" },
              { t: "Comercial", s: "Locales, oficinas y plazas.", img: "/landing/comercial.jpg" },
            ].map((p) => (
              <div key={p.t} className="bg-white border border-forest-100 rounded-xl overflow-hidden hover:border-forest-600 transition-colors group">
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={p.img} alt={p.t} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="font-semibold text-forest-800 mb-1">{p.t}</div>
                  <div className="text-sm text-forest-800/60">{p.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPLEMENTACIÓN */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="text-xs tracking-wider uppercase text-forest-600 mb-3">Implementación</div>
            <h2 className="serif text-3xl md:text-4xl text-forest-800 font-semibold mb-6">Nosotros lo implementamos por ti.</h2>
            <p className="text-forest-800/70 mb-8">Tú sigues vendiendo, nosotros configuramos. En unas semanas tienes tu DealRoom funcionando con tu marca, tus propiedades y tu Agente IA listo para responder.</p>
            <div className="space-y-5">
              {[
                { n: 1, t: "Entendemos tu operación", d: "Revisamos tu proceso comercial y objetivos." },
                { n: 2, t: "Configuramos la plataforma", d: "Agente IA, CRM, portales y propiedades." },
                { n: 3, t: "Personalizamos tu marca", d: "DealRoom y micrositio con tu identidad visual." },
                { n: 4, t: "Acompañamos a tu equipo", d: "Capacitación y puesta en marcha sin fricción técnica." },
              ].map((s) => (
                <div key={s.n} className="border-l-2 border-forest-600 pl-5">
                  <div className="text-forest-600 text-sm font-semibold mb-1">0{s.n}</div>
                  <div className="font-semibold text-forest-800 mb-1">{s.t}</div>
                  <div className="text-sm text-forest-800/70">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-forest-100 shadow-xl">
              <img src="/landing/implementacion.png" alt="Dashboard DealRoom con CRM y gestión de leads inmobiliarios" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL con fondo image */}
      <section className="relative py-24 bg-forest-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/landing/cta-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(22,59,35,0.88),rgba(10,22,40,0.92))]" />
        <div className="relative container mx-auto px-6 lg:px-12 text-center max-w-3xl">
          <h3 className="serif text-3xl md:text-4xl font-semibold mb-4">Vea cómo DealRoom puede funcionar con tus propiedades.</h3>
          <p className="text-forest-100/80 mb-8">Agenda una demo privada de 30 minutos. Te mostramos cómo se vería con tu catálogo y tu marca.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CALENDAR} target="_blank" rel="noopener" className="px-7 py-3.5 bg-white text-forest-800 font-medium rounded hover:bg-forest-50">📅 Agendar una demo privada</a>
            <Link href={DEMO} className="px-7 py-3.5 border border-white/40 text-white font-medium rounded hover:bg-white/10">▶ Probar el demo en vivo</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-white border-t border-forest-100">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-forest-800/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-forest-600 rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-forest-600 -rotate-45" />
            </div>
            <span className="serif text-forest-800">DealRoom</span>
            <span className="text-forest-800/40 ml-2">por Geekify</span>
          </div>
          <div className="flex gap-6">
            <a href="#como-funciona" className="hover:text-forest-600">Cómo funciona</a>
            <a href="#plataforma" className="hover:text-forest-600">Plataforma</a>
            <a href="#para-quien" className="hover:text-forest-600">Para quién</a>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} DealRoom · Todos los derechos reservados.</div>
        </div>
      </footer>
    </main>
  );
}

function Metric({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="serif text-5xl md:text-6xl text-forest-600 font-semibold mb-1">{n}</div>
      <div className="text-sm text-forest-800/70">{l}</div>
    </div>
  );
}
