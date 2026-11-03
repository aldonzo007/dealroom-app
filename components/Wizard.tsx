"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = [
  { v: "terreno", l: "Terreno" },
  { v: "bodega_industrial", l: "Bodega industrial" },
  { v: "nave_industrial", l: "Nave industrial" },
  { v: "oficina", l: "Oficina" },
  { v: "local_comercial", l: "Local comercial" },
  { v: "casa", l: "Casa" },
  { v: "departamento", l: "Departamento" },
  { v: "edificio", l: "Edificio" },
];
const CIUDADES = ["CDMX", "Estado de México", "Querétaro", "Monterrey", "Guadalajara", "San Luis Potosí", "Mérida", "Puebla"];
const OBJETIVOS = [
  { v: "inversion_con_renta", l: "Inversión con renta" },
  { v: "reventa", l: "Reventa / plusvalía" },
  { v: "operacion_propia", l: "Operación propia" },
  { v: "patrimonial", l: "Patrimonial" },
  { v: "uso_mixto", l: "Uso mixto / desarrollo" },
];
const PRESUPUESTOS = [
  { v: 8000000, l: "Menos de $10M" },
  { v: 20000000, l: "$10M a $30M" },
  { v: 55000000, l: "$30M a $80M" },
  { v: 110000000, l: "$80M a $150M" },
  { v: 200000000, l: "Más de $150M" },
];
const TIMINGS = [
  { v: "inmediato", l: "Lo antes posible" },
  { v: "3_meses", l: "En los próximos 3 meses" },
  { v: "6_meses", l: "En 3 a 6 meses" },
  { v: "explorando", l: "Solo explorando" },
];

export default function Wizard({ slug, colorPrimario }: { slug: string; colorPrimario: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tipos, setTipos] = useState<string[]>([]);
  const [operacion, setOperacion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [presupuesto, setPresupuesto] = useState(0);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const steps = [
    { title: "¿Qué tipo de inmueble busca?", valid: tipos.length > 0 },
    { title: "¿Venta o renta?", valid: !!operacion },
    { title: "¿Cuál es su objetivo?", valid: !!objetivo },
    { title: "¿Cuánto piensa invertir?", valid: presupuesto > 0 },
    { title: "¿En qué ciudades?", valid: ciudades.length > 0 },
    { title: "¿Cuándo piensa decidir?", valid: !!timing },
    { title: "Último paso: sus datos", valid: nombre.trim() !== "" && (email.trim() !== "" || whatsapp.trim() !== "") },
  ];

  async function finish() {
    setLoading(true);
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_slug: slug,
          nombre, email, whatsapp,
          perfil: {
            tipo_buscado: tipos, operacion, objetivo,
            presupuesto, ciudades, timing,
          },
        }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        router.push(`/${slug}/d/${data.token}`);
      } else {
        alert("Hubo un problema. Intente de nuevo.");
        setLoading(false);
      }
    } catch {
      alert("Hubo un problema de conexión.");
      setLoading(false);
    }
  }

  const cur = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      {/* Progreso */}
      <div className="h-1 bg-white/10">
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: colorPrimario }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: colorPrimario }}>
            Paso {step + 1} de {steps.length}
          </div>
          <h2 className="serif text-3xl md:text-4xl mb-10">{cur.title}</h2>

          {step === 0 && <Chips options={TIPOS} selected={tipos} onToggle={(v) => toggle(tipos, setTipos, v)} multi />}
          {step === 1 && <Chips options={[{ v: "venta", l: "Venta" }, { v: "renta", l: "Renta" }, { v: "ambas", l: "Cualquiera" }]} selected={operacion ? [operacion] : []} onToggle={setOperacion} />}
          {step === 2 && <Chips options={OBJETIVOS} selected={objetivo ? [objetivo] : []} onToggle={setObjetivo} />}
          {step === 3 && <Chips options={PRESUPUESTOS.map((p) => ({ v: String(p.v), l: p.l }))} selected={presupuesto ? [String(presupuesto)] : []} onToggle={(v) => setPresupuesto(+v)} />}
          {step === 4 && <Chips options={CIUDADES.map((c) => ({ v: c, l: c }))} selected={ciudades} onToggle={(v) => toggle(ciudades, setCiudades, v)} multi />}
          {step === 5 && <Chips options={TIMINGS} selected={timing ? [timing] : []} onToggle={setTiming} />}
          {step === 6 && (
            <div className="space-y-4">
              <Input label="Nombre" value={nombre} onChange={setNombre} placeholder="Su nombre" />
              <Input label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="55 1234 5678" />
              <Input label="Email" value={email} onChange={setEmail} placeholder="correo@ejemplo.com" />
              <p className="text-white/40 text-sm">En cuanto termine, verá su selección personalizada al instante.</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-12">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-white/50 hover:text-white disabled:opacity-0 text-sm">
              ← Atrás
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!cur.valid} className="px-8 py-3 font-semibold text-navy-900 disabled:opacity-30 transition-opacity" style={{ background: colorPrimario }}>
                Continuar
              </button>
            ) : (
              <button onClick={finish} disabled={!cur.valid || loading} className="px-8 py-3 font-semibold text-navy-900 disabled:opacity-30 transition-opacity" style={{ background: colorPrimario }}>
                {loading ? "Armando su selección..." : "Ver mi selección"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chips({ options, selected, onToggle, multi }: { options: { v: string; l: string }[]; selected: string[]; onToggle: (v: string) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => {
        const on = selected.includes(o.v);
        return (
          <button key={o.v} onClick={() => onToggle(o.v)} className={`px-5 py-3 border text-left transition-colors ${on ? "border-gold bg-gold/10 text-white" : "border-white/20 text-white/70 hover:border-white/50"}`}>
            {o.l}
          </button>
        );
      })}
      {multi && <div className="w-full text-white/40 text-xs mt-1">Puede elegir varias</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-xs tracking-wider text-gold uppercase mb-2">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-navy-800 border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:border-gold outline-none" />
    </div>
  );
}
