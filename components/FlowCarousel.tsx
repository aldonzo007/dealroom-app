"use client";
import { useEffect, useState } from "react";

type Step = {
  key: string;
  label: string;
  desc: string;
  render: () => React.ReactNode;
};

const STEPS: Step[] = [
  {
    key: "precal",
    label: "1 · Pre-calificación con IA",
    desc: "El agente o el wizard entienden qué busca tu prospecto y arman su perfil en segundos.",
    render: () => <PreCalMock />,
  },
  {
    key: "dealroom",
    label: "2 · Deal Room personalizado",
    desc: "Cada prospecto recibe su portafolio privado con las propiedades que sí encajan.",
    render: () => <DealRoomMock />,
  },
  {
    key: "analisis",
    label: "3 · Análisis de inversión",
    desc: "Precio, superficie, renta estimada, plusvalía y ROI. Números, no palabras.",
    render: () => <AnalisisMock />,
  },
  {
    key: "agendar",
    label: "4 · Agenda y WhatsApp",
    desc: "Cuando está listo, agenda su visita o habla con el asesor, directo desde el portal.",
    render: () => <AgendarMock />,
  },
  {
    key: "crm",
    label: "5 · Seguimiento en tu CRM",
    desc: "Todo el calor del prospecto queda registrado. Tu asesor sabe cuándo marcarle.",
    render: () => <CRMMock />,
  },
];

export default function FlowCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % STEPS.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const step = STEPS[active];

  return (
    <div className="space-y-5">
      {/* Canvas del mockup */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-forest-100 overflow-hidden min-h-[420px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Barra tipo navegador */}
        <div className="bg-forest-50 px-5 py-3 flex items-center gap-2 border-b border-forest-100">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-forest-800/50">{step.key}.dealroom.mx</span>
        </div>
        <div className="p-6 relative">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`transition-all duration-500 ${i === active ? "opacity-100" : "opacity-0 absolute inset-6 pointer-events-none"}`}
            >
              {i === active && s.render()}
            </div>
          ))}
        </div>
      </div>

      {/* Steps clickables */}
      <div className="grid grid-cols-5 gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => { setActive(i); setPaused(true); }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`text-left transition-all pt-2 border-t-2 ${i === active ? "border-forest-600" : "border-forest-200 hover:border-forest-400"}`}
          >
            <div className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${i === active ? "text-forest-700" : "text-forest-800/50"}`}>
              {s.label.split(" · ")[0]}
            </div>
            <div className={`text-[11px] leading-tight mt-1 hidden md:block ${i === active ? "text-forest-800" : "text-forest-800/50"}`}>
              {s.label.split(" · ")[1]}
            </div>
          </button>
        ))}
      </div>

      {/* Descripción del paso activo */}
      <div className="bg-white border border-forest-100 rounded-lg p-4 text-sm text-forest-800/80">
        {step.desc}
      </div>
    </div>
  );
}

/* ---------- MOCKUPS DE CADA PASO ---------- */

function PreCalMock() {
  return (
    <div className="space-y-4">
      <div className="text-xs tracking-wider text-forest-600 uppercase">Pre-calificación</div>
      <div className="serif text-xl text-forest-800">Hola, ayúdame a encontrar tu inversión.</div>

      {/* Chat con agente */}
      <div className="bg-forest-50/50 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
          <div className="bg-white border border-forest-100 rounded-lg p-2.5 text-xs flex-1">¿Qué tipo de inmueble te interesa?</div>
        </div>
        <div className="flex items-start gap-2 justify-end">
          <div className="bg-forest-600 text-white rounded-lg p-2.5 text-xs">Edificio para inversión, CDMX, 20 a 35M</div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
          <div className="bg-white border border-forest-100 rounded-lg p-2.5 text-xs flex-1">Perfecto. Te armo tu portafolio personalizado.</div>
        </div>
      </div>

      {/* Perfil armado */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        {[
          { l: "Objetivo", v: "Inversión" },
          { l: "Zona", v: "CDMX" },
          { l: "Monto", v: "$20–35M" },
          { l: "Tipo", v: "Edificio" },
        ].map((c) => (
          <div key={c.l} className="bg-forest-50 rounded p-2">
            <div className="text-[9px] uppercase tracking-wider text-forest-600">{c.l}</div>
            <div className="text-xs font-semibold text-forest-800 truncate">{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealRoomMock() {
  return (
    <div className="space-y-4">
      <div className="text-xs tracking-wider text-forest-600 uppercase">Portafolio privado</div>
      <div className="serif text-xl text-forest-800">Jaime, tu selección privada.</div>
      <div className="flex gap-2 text-[10px] flex-wrap">
        <span className="px-2 py-1 bg-forest-50 text-forest-700 rounded">Inversión</span>
        <span className="px-2 py-1 bg-forest-50 text-forest-700 rounded">$20–35M</span>
        <span className="px-2 py-1 bg-forest-50 text-forest-700 rounded">CDMX</span>
      </div>

      {/* Destacado */}
      <div className="border border-forest-100 rounded-lg overflow-hidden flex">
        <div className="w-24 bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-white/30 text-xs flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14" /></svg>
        </div>
        <div className="p-3 flex-1">
          <div className="text-[10px] tracking-wider uppercase text-forest-600 mb-0.5">Destacado</div>
          <div className="serif text-sm font-semibold text-forest-800">Edificio en Condesa</div>
          <div className="text-[10px] text-forest-800/60 mb-1">Condesa, CDMX</div>
          <div className="serif text-base font-semibold text-forest-800">$32.5M MXN</div>
        </div>
      </div>

      {/* 2 más chicas */}
      <div className="grid grid-cols-2 gap-2">
        {["Edificio Agrícola", "Terreno Iztacalco"].map((n, i) => (
          <div key={n} className="border border-forest-100 rounded p-2">
            <div className={`w-full h-12 rounded mb-2 ${i === 0 ? "bg-gradient-to-br from-forest-200 to-forest-100" : "bg-gradient-to-br from-forest-100 to-forest-50"}`} />
            <div className="serif text-xs font-semibold text-forest-800 truncate">{n}</div>
            <div className="text-[10px] text-forest-800/60">{i === 0 ? "$21.8M" : "$28M"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalisisMock() {
  return (
    <div className="space-y-4">
      <div className="text-xs tracking-wider text-forest-600 uppercase">Análisis de inversión</div>
      <div className="serif text-xl text-forest-800">Resumen ejecutivo</div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { l: "Precio", v: "$32.5M", s: "MXN" },
          { l: "Superficie", v: "1,280", s: "m²" },
          { l: "Renta est.", v: "$230K", s: "/ mes" },
          { l: "Yield", v: "8.5%", s: "anual" },
        ].map((c) => (
          <div key={c.l} className="bg-forest-50 rounded p-2">
            <div className="text-[9px] uppercase tracking-wider text-forest-600 mb-0.5">{c.l}</div>
            <div className="serif text-sm font-semibold text-forest-800">{c.v}</div>
            <div className="text-[9px] text-forest-800/50">{c.s}</div>
          </div>
        ))}
      </div>

      {/* Calculadora */}
      <div className="border border-forest-100 rounded-lg p-3 space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold">Calculadora ROI</div>
        <div className="space-y-1.5">
          {[
            { l: "Enganche", v: "30%", w: 30 },
            { l: "Plazo", v: "15 años", w: 70 },
            { l: "Tasa", v: "11.5%", w: 55 },
          ].map((s) => (
            <div key={s.l}>
              <div className="flex justify-between text-[10px] text-forest-800/70 mb-0.5">
                <span>{s.l}</span>
                <span className="font-semibold text-forest-800">{s.v}</span>
              </div>
              <div className="h-1.5 bg-forest-100 rounded-full overflow-hidden">
                <div className="h-full bg-forest-600 rounded-full" style={{ width: `${s.w}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-forest-100">
          <span className="text-[10px] text-forest-800/70">ROI estimado</span>
          <span className="serif text-base font-semibold text-forest-700">14.2% anual</span>
        </div>
      </div>
    </div>
  );
}

function AgendarMock() {
  return (
    <div className="space-y-4">
      <div className="text-xs tracking-wider text-forest-600 uppercase">Siguiente paso</div>
      <div className="serif text-xl text-forest-800">¿Listo para avanzar?</div>

      {/* Asesor */}
      <div className="flex items-center gap-3 bg-forest-50/60 rounded-lg p-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-200 to-forest-100 flex items-center justify-center serif text-lg font-semibold text-forest-700">J</div>
        <div className="flex-1 min-w-0">
          <div className="serif text-sm font-semibold text-forest-800">Jaime Soriano</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-600">Real Estate Advisor</div>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-2">
        <div className="bg-forest-600 text-white rounded-md p-2.5 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            Agendar visita
          </span>
          <span>→</span>
        </div>
        <div className="bg-white border border-forest-200 text-forest-800 rounded-md p-2.5 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.3 0 1.4 1 2.7 1.2 2.9.1.2 2 3 4.7 4.1 1.1.5 2 .7 2.6.8.6.1 1.2.1 1.6 0 .5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.5-.3z" /></svg>
            Hablar por WhatsApp
          </span>
          <span>→</span>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white border border-forest-100 rounded-lg p-3">
        <div className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold mb-2">Agenda disponible</div>
        <div className="grid grid-cols-4 gap-1.5">
          {["Lun 10", "Mar 11", "Mié 12", "Jue 13"].map((d, i) => (
            <div key={d} className={`text-center py-1.5 rounded text-[10px] font-medium ${i === 1 ? "bg-forest-600 text-white" : "bg-forest-50 text-forest-700"}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {["10:00", "12:30", "16:00"].map((h, i) => (
            <div key={h} className={`text-center py-1.5 rounded text-[10px] font-medium ${i === 0 ? "bg-forest-100 text-forest-700 ring-1 ring-forest-600" : "bg-forest-50 text-forest-700/70"}`}>
              {h}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CRMMock() {
  return (
    <div className="space-y-4">
      <div className="text-xs tracking-wider text-forest-600 uppercase">CRM · Seguimiento</div>
      <div className="serif text-xl text-forest-800">Jaime Soriano</div>

      {/* Score de calor */}
      <div className="bg-forest-50/60 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold">Score de calor</span>
          <span className="serif text-lg font-semibold text-forest-700">85°</span>
        </div>
        <div className="h-2 bg-forest-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-forest-500 via-forest-600 to-forest-700" style={{ width: "85%" }} />
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <span className="px-1.5 py-0.5 bg-forest-600 text-white rounded text-[9px] font-semibold uppercase tracking-wider">Caliente</span>
          <span className="px-1.5 py-0.5 bg-white border border-forest-200 text-forest-700 rounded text-[9px] font-semibold uppercase tracking-wider">Agendó</span>
        </div>
      </div>

      {/* Timeline eventos */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold">Actividad reciente</div>
        {[
          { t: "19:04", e: "Agendó visita", p: "+40" },
          { t: "18:58", e: "Usó la calculadora", p: "+20" },
          { t: "18:52", e: "Descargó ficha PDF", p: "+15" },
          { t: "18:48", e: "Abrió el Deal Room", p: "+10" },
        ].map((ev) => (
          <div key={ev.t} className="flex items-center justify-between py-1.5 border-b border-forest-100 last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-forest-600" />
              <span className="text-[10px] text-forest-800/50 w-10">{ev.t}</span>
              <span className="text-xs text-forest-800">{ev.e}</span>
            </div>
            <span className="text-[10px] font-semibold text-forest-700">{ev.p}</span>
          </div>
        ))}
      </div>

      {/* Tarea al asesor */}
      <div className="bg-forest-600 text-white rounded-lg p-2.5 flex items-start gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 2" /></svg>
        <div className="text-[11px] font-medium leading-snug">Tarea: llamar a Jaime antes de las 11am. Deal room abierto 3 veces en 2h.</div>
      </div>
    </div>
  );
}
