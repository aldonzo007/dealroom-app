"use client";
import { useState, useMemo, useRef } from "react";
import { Inmueble, formatMXN } from "@/lib/types";
import { track } from "@/lib/track";

export default function Calculadora({ inm, token }: { inm: Inmueble; token?: string }) {
  const [enganchePct, setEnganchePct] = useState(30);
  const [plazoAnos, setPlazoAnos] = useState(15);
  const [tasaAnual, setTasaAnual] = useState(11.5);
  const tracked = useRef(false);

  function onInteract() {
    if (!tracked.current && token) {
      tracked.current = true;
      track(token, "calculadora_usada", inm.id);
    }
  }

  const calc = useMemo(() => {
    const precio = inm.precio_venta || 0;
    const enganche = precio * (enganchePct / 100);
    const monto = precio - enganche;
    const tasaMensual = tasaAnual / 100 / 12;
    const n = plazoAnos * 12;
    const pago = monto > 0 && tasaMensual > 0
      ? (monto * tasaMensual * Math.pow(1 + tasaMensual, n)) / (Math.pow(1 + tasaMensual, n) - 1)
      : 0;
    const m2 = inm.m2_construidos > 0 ? inm.m2_construidos : inm.m2_terreno;
    const rentaAnual = m2 * inm.renta_promedio_m2 * 12 * (inm.ocupacion_zona / 100);
    const roi = precio > 0 ? (rentaAnual / precio) * 100 : 0;
    return { enganche, monto, pago, rentaAnual, roi, totalPagar: pago * n };
  }, [enganchePct, plazoAnos, tasaAnual, inm]);

  if (!inm.precio_venta) return null;

  return (
    <section id="analisis" className="py-20 lg:py-32 bg-navy-900 text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-4">Herramientas patrimoniales</div>
          <h2 className="serif text-4xl md:text-5xl text-white mb-4">Análisis <span className="gold-gradient">Financiero</span></h2>
          <p className="text-white/70 text-lg">Modele el escenario de apalancamiento y estime el retorno con datos reales de la zona.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8" onPointerDown={onInteract}>
            <Slider label="Enganche" value={`${enganchePct}%`} sub={formatMXN(calc.enganche)}>
              <input type="range" min={10} max={80} value={enganchePct} onChange={(e) => setEnganchePct(+e.target.value)} className="w-full accent-gold" />
            </Slider>
            <Slider label="Plazo" value={`${plazoAnos} años`}>
              <input type="range" min={5} max={25} value={plazoAnos} onChange={(e) => setPlazoAnos(+e.target.value)} className="w-full accent-gold" />
            </Slider>
            <Slider label="Tasa anual" value={`${tasaAnual.toFixed(1)}%`}>
              <input type="range" min={8} max={16} step={0.1} value={tasaAnual} onChange={(e) => setTasaAnual(+e.target.value)} className="w-full accent-gold" />
            </Slider>
          </div>

          <div className="space-y-5 bg-navy-800 p-8 border border-gold/20">
            <div className="border-b border-white/10 pb-5">
              <div className="text-xs tracking-wider text-gold/80 uppercase mb-1">Mensualidad estimada</div>
              <div className="serif text-4xl text-white">{formatMXN(calc.pago)}</div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Stat label="Monto a financiar" value={formatMXN(calc.monto)} />
              <Stat label="Total a pagar" value={formatMXN(calc.totalPagar)} />
            </div>
            {calc.roi > 0 && (
              <div className="border-t border-white/10 pt-5">
                <div className="text-xs tracking-wider text-gold/80 uppercase mb-1">ROI anual estimado por renta</div>
                <div className="serif text-3xl text-gold">{calc.roi.toFixed(1)}%</div>
                <div className="text-white/60 text-sm mt-1">Renta anual estimada: {formatMXN(calc.rentaAnual)}</div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-white/40 text-xs max-w-2xl">Estimaciones referenciales con datos de mercado. Para dictamen formal consulte con su broker asignado.</div>
      </div>
    </section>
  );
}

function Slider({ label, value, sub, children }: { label: string; value: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="text-sm tracking-wider text-gold uppercase">{label}</label>
        <span className="serif text-xl text-white">{value}</span>
      </div>
      {children}
      {sub && <div className="text-white/60 text-sm mt-1">{sub}</div>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs tracking-wider text-white/50 uppercase mb-1">{label}</div>
      <div className="serif text-lg text-white">{value}</div>
    </div>
  );
}
