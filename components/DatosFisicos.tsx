import { Inmueble } from "@/lib/types";

interface Dato { label: string; value: string; }

function getDatos(inm: Inmueble): Dato[] {
  const d: Dato[] = [];
  const nf = (n: number) => n.toLocaleString("es-MX");

  if (inm.ciudad) d.push({ label: "Ciudad", value: inm.ciudad });
  if (inm.zona) d.push({ label: "Zona", value: inm.zona });

  if (inm.tipo === "terreno") {
    if (inm.m2_terreno) d.push({ label: "Superficie", value: `${nf(inm.m2_terreno)} m²` });
    if (inm.m2_construidos) d.push({ label: "Construcción", value: `${nf(inm.m2_construidos)} m²` });
  }
  if (inm.tipo === "bodega_industrial" || inm.tipo === "nave_industrial") {
    if (inm.m2_construidos) d.push({ label: "M² construidos", value: `${nf(inm.m2_construidos)} m²` });
    if (inm.m2_terreno) d.push({ label: "M² terreno", value: `${nf(inm.m2_terreno)} m²` });
    if (inm.altura_libre) d.push({ label: "Altura libre", value: `${inm.altura_libre} m` });
    if (inm.andenes) d.push({ label: "Andenes de carga", value: `${inm.andenes}` });
  }
  if (inm.tipo === "oficina" || inm.tipo === "local_comercial") {
    if (inm.m2_construidos) d.push({ label: "Superficie", value: `${nf(inm.m2_construidos)} m²` });
    if (inm.cajones) d.push({ label: "Estacionamientos", value: `${inm.cajones}` });
    if (inm.banos) d.push({ label: "Baños", value: `${inm.banos}` });
  }
  if (inm.tipo === "casa" || inm.tipo === "departamento") {
    if (inm.m2_construidos) d.push({ label: "Construcción", value: `${nf(inm.m2_construidos)} m²` });
    if (inm.m2_terreno && inm.tipo === "casa") d.push({ label: "Terreno", value: `${nf(inm.m2_terreno)} m²` });
    if (inm.recamaras) d.push({ label: "Recámaras", value: `${inm.recamaras}` });
    if (inm.banos) d.push({ label: "Baños", value: `${inm.banos}` });
    if (inm.cajones) d.push({ label: "Estacionamientos", value: `${inm.cajones}` });
  }
  if (inm.tipo === "edificio") {
    if (inm.m2_construidos) d.push({ label: "Construcción total", value: `${nf(inm.m2_construidos)} m²` });
    if (inm.m2_terreno) d.push({ label: "Terreno", value: `${nf(inm.m2_terreno)} m²` });
    if (inm.cajones) d.push({ label: "Cajones", value: `${inm.cajones}` });
  }
  if (inm.ano_construccion) d.push({ label: "Año", value: inm.ano_construccion });

  return d;
}

export default function DatosFisicos({ inm }: { inm: Inmueble }) {
  const datos = getDatos(inm);
  if (!datos.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {datos.map((d, i) => (
        <div key={i} className="border border-navy-900/10 p-5 bg-white">
          <div className="text-xs tracking-[0.2em] text-navy-900/50 uppercase mb-2">{d.label}</div>
          <div className="serif text-xl text-navy-900 font-medium">{d.value}</div>
        </div>
      ))}
    </div>
  );
}
