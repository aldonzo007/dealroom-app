"use client";
import { useState } from "react";
import { Inmueble, Cliente, formatMXN, tipoLabel } from "@/lib/types";

const TIPOS = ["terreno", "bodega_industrial", "nave_industrial", "oficina", "local_comercial", "casa", "departamento", "edificio"];
const RANGOS = ["bajo", "medio", "alto", "premium", "ultra"];
const OBJETIVOS = ["inversion_con_renta", "reventa", "operacion_propia", "patrimonial", "uso_mixto"];

type FormState = {
  id?: string;
  client_id: string;
  nombre_interno: string; tipo: string; operacion: string; estatus: string;
  descripcion: string;
  ciudad: string; zona: string; direccion: string; maps_link: string;
  m2_construidos: number; m2_terreno: number; ano_construccion: string;
  altura_libre: number; andenes: number; cajones: number; banos: number; recamaras: number;
  precio_venta: number; precio_renta: number; rango_inversion: string;
  renta_promedio_m2: number; ocupacion_zona: number; plusvalia_anual: number;
  fotos: string[]; pdf_ficha: string; video_tour: string;
  broker_nombre: string; broker_whatsapp: string;
  objetivo_recomendado: string[];
};

function vacio(clientId: string): FormState {
  return {
    client_id: clientId,
    nombre_interno: "", tipo: "terreno", operacion: "venta", estatus: "disponible",
    descripcion: "",
    ciudad: "", zona: "", direccion: "", maps_link: "",
    m2_construidos: 0, m2_terreno: 0, ano_construccion: "", altura_libre: 0, andenes: 0, cajones: 0, banos: 0, recamaras: 0,
    precio_venta: 0, precio_renta: 0, rango_inversion: "alto",
    renta_promedio_m2: 0, ocupacion_zona: 0, plusvalia_anual: 0,
    fotos: [], pdf_ficha: "", video_tour: "", broker_nombre: "", broker_whatsapp: "",
    objetivo_recomendado: [],
  };
}

export default function AdminPanel({ cliente, inmuebles }: { cliente: Cliente; inmuebles: Inmueble[] }) {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(vacio(cliente.id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [list, setList] = useState(inmuebles);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) { setForm((f) => ({ ...f, [k]: v })); }

  function nuevo() { setForm(vacio(cliente.id)); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function editar(inm: Inmueble) {
    setForm({ ...(inm as any) });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function subirArchivos(files: FileList | null, destino: "fotos" | "pdf") {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-pass": pass }, body: fd });
      const data = await res.json();
      if (data.ok) {
        if (destino === "fotos") set("fotos", [...form.fotos, ...data.urls]);
        else set("pdf_ficha", data.urls[0]);
      } else {
        alert("Error al subir: " + (data.error || ""));
      }
    } finally {
      setUploading(false);
    }
  }

  async function guardar() {
    setSaving(true);
    const res = await fetch("/api/admin/inmueble", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) window.location.reload();
    else alert("Error: " + (data.error || "no se pudo guardar"));
  }

  async function borrar(id: string) {
    if (!confirm("¿Eliminar este inmueble?")) return;
    await fetch("/api/admin/inmueble", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-pass": pass }, body: JSON.stringify({ id }) });
    setList((l) => l.filter((x) => x.id !== id));
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="serif text-2xl mb-6">Admin · {cliente.nombre}</h1>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" className="w-full bg-navy-800 border border-white/20 px-4 py-3 mb-4 text-white placeholder-white/30 outline-none focus:border-gold" />
          <button onClick={() => pass && setAuthed(true)} className="w-full bg-gold text-navy-900 py-3 font-semibold">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="serif text-3xl text-navy-900">Inmuebles · {cliente.nombre}</h1>
          <button onClick={showForm ? () => setShowForm(false) : nuevo} className="bg-navy-900 text-white px-5 py-2.5 text-sm font-medium">
            {showForm ? "Cerrar" : "+ Agregar inmueble"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-navy-900/10 p-6 mb-8 space-y-4">
            {form.id && <div className="text-xs text-gold-dark uppercase tracking-wide">Editando: {form.nombre_interno}</div>}
            <F label="Nombre interno"><input className="inp" value={form.nombre_interno} onChange={(e) => set("nombre_interno", e.target.value)} /></F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Tipo"><select className="inp" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>{TIPOS.map((t) => <option key={t} value={t}>{tipoLabel(t as any)}</option>)}</select></F>
              <F label="Operación"><select className="inp" value={form.operacion} onChange={(e) => set("operacion", e.target.value)}><option value="venta">Venta</option><option value="renta">Renta</option><option value="ambas">Ambas</option></select></F>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <F label="Ciudad"><input className="inp" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} /></F>
              <F label="Zona"><input className="inp" value={form.zona} onChange={(e) => set("zona", e.target.value)} /></F>
              <F label="Estatus"><select className="inp" value={form.estatus} onChange={(e) => set("estatus", e.target.value)}><option value="disponible">Disponible</option><option value="apartado">Apartado</option><option value="vendido">Vendido</option><option value="pausado">Pausado</option></select></F>
            </div>
            <F label="Dirección"><input className="inp" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} /></F>
            <F label="Descripción / detalles (se muestra en el deal room)">
              <textarea className="inp" rows={5} value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Describe el inmueble, uso de suelo, oportunidad, detalles técnicos relevantes, etc." />
            </F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Precio venta MXN"><input type="number" className="inp" value={form.precio_venta} onChange={(e) => set("precio_venta", +e.target.value)} /></F>
              <F label="Rango inversión"><select className="inp" value={form.rango_inversion} onChange={(e) => set("rango_inversion", e.target.value)}>{RANGOS.map((r) => <option key={r} value={r}>{r}</option>)}</select></F>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <F label="M² construidos"><input type="number" className="inp" value={form.m2_construidos} onChange={(e) => set("m2_construidos", +e.target.value)} /></F>
              <F label="M² terreno"><input type="number" className="inp" value={form.m2_terreno} onChange={(e) => set("m2_terreno", +e.target.value)} /></F>
              <F label="Recámaras"><input type="number" className="inp" value={form.recamaras} onChange={(e) => set("recamaras", +e.target.value)} /></F>
              <F label="Baños"><input type="number" className="inp" value={form.banos} onChange={(e) => set("banos", +e.target.value)} /></F>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <F label="Altura libre"><input type="number" className="inp" value={form.altura_libre} onChange={(e) => set("altura_libre", +e.target.value)} /></F>
              <F label="Andenes"><input type="number" className="inp" value={form.andenes} onChange={(e) => set("andenes", +e.target.value)} /></F>
              <F label="Cajones"><input type="number" className="inp" value={form.cajones} onChange={(e) => set("cajones", +e.target.value)} /></F>
              <F label="Año"><input className="inp" value={form.ano_construccion} onChange={(e) => set("ano_construccion", e.target.value)} /></F>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <F label="Renta prom. m² (zona)"><input type="number" className="inp" value={form.renta_promedio_m2} onChange={(e) => set("renta_promedio_m2", +e.target.value)} /></F>
              <F label="Ocupación zona %"><input type="number" className="inp" value={form.ocupacion_zona} onChange={(e) => set("ocupacion_zona", +e.target.value)} /></F>
              <F label="Plusvalía anual %"><input type="number" className="inp" value={form.plusvalia_anual} onChange={(e) => set("plusvalia_anual", +e.target.value)} /></F>
            </div>
            <F label="Objetivo recomendado">
              <div className="flex flex-wrap gap-2">
                {OBJETIVOS.map((o) => {
                  const on = form.objetivo_recomendado.includes(o);
                  return <button key={o} type="button" onClick={() => set("objetivo_recomendado", on ? form.objetivo_recomendado.filter((x) => x !== o) : [...form.objetivo_recomendado, o])} className={`px-3 py-1.5 text-xs border ${on ? "border-gold bg-gold/10" : "border-navy-900/20"}`}>{o}</button>;
                })}
              </div>
            </F>

            {/* FOTOS */}
            <F label="Fotos">
              <div className="space-y-3">
                {form.fotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {form.fotos.map((url, i) => (
                      <div key={i} className="relative aspect-square group">
                        <img src={url} alt="" className="w-full h-full object-cover border border-navy-900/10" />
                        <button type="button" onClick={() => set("fotos", form.fotos.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-navy-900/80 text-white w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" accept="image/*" multiple onChange={(e) => subirArchivos(e.target.files, "fotos")} className="text-sm" />
                {uploading && <span className="text-xs text-gold-dark ml-2">Subiendo...</span>}
              </div>
            </F>

            {/* PDF */}
            <F label="Ficha técnica (PDF)">
              <div className="space-y-2">
                {form.pdf_ficha && <a href={form.pdf_ficha} target="_blank" rel="noopener" className="text-sm text-gold-dark underline block">Ver PDF actual</a>}
                <input type="file" accept="application/pdf" onChange={(e) => subirArchivos(e.target.files, "pdf")} className="text-sm" />
              </div>
            </F>

            <div className="grid grid-cols-2 gap-4">
              <F label="Video o tour (URL YouTube/Vimeo)"><input className="inp" value={form.video_tour} onChange={(e) => set("video_tour", e.target.value)} /></F>
              <F label="Maps link (URL)"><input className="inp" value={form.maps_link} onChange={(e) => set("maps_link", e.target.value)} /></F>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F label="Broker nombre"><input className="inp" value={form.broker_nombre} onChange={(e) => set("broker_nombre", e.target.value)} /></F>
              <F label="Broker WhatsApp"><input className="inp" value={form.broker_whatsapp} onChange={(e) => set("broker_whatsapp", e.target.value)} /></F>
            </div>
            <button onClick={guardar} disabled={saving || uploading || !form.nombre_interno} className="bg-gold text-navy-900 px-6 py-3 font-semibold disabled:opacity-40">
              {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear inmueble"}
            </button>
          </div>
        )}

        <div className="bg-white border border-navy-900/10 divide-y divide-navy-900/10">
          {list.map((inm) => (
            <div key={inm.id} className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 bg-navy-800/5 overflow-hidden flex-shrink-0">
                {inm.fotos[0] && <img src={inm.fotos[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-navy-900 truncate">{inm.nombre_interno}</div>
                <div className="text-navy-900/50 text-sm">{tipoLabel(inm.tipo)} · {inm.zona || inm.ciudad} · {formatMXN(inm.precio_venta)}</div>
              </div>
              <span className={`text-xs px-2 py-1 ${inm.estatus === "disponible" ? "bg-green-100 text-green-700" : "bg-navy-900/10 text-navy-900/60"}`}>{inm.estatus}</span>
              <button onClick={() => editar(inm)} className="text-navy-900 text-sm hover:underline">Editar</button>
              <button onClick={() => borrar(inm.id)} className="text-red-500 text-sm hover:underline">Eliminar</button>
            </div>
          ))}
          {list.length === 0 && <div className="p-8 text-center text-navy-900/40">Sin inmuebles. Agrega el primero.</div>}
        </div>
      </div>

      <style>{`.inp{width:100%;border:1px solid rgba(10,22,40,0.2);padding:0.5rem 0.75rem;font-size:0.9rem;outline:none}.inp:focus{border-color:#C5A059}`}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-wide text-navy-900/60 uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}
