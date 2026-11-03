import { Inmueble, PerfilProspecto } from "./types";

const RANGOS: Record<string, { min: number; max: number }> = {
  bajo: { min: 0, max: 10000000 },
  medio: { min: 10000000, max: 30000000 },
  alto: { min: 30000000, max: 80000000 },
  premium: { min: 80000000, max: 150000000 },
  ultra: { min: 150000000, max: 9999999999 },
};

// Calcula score de match de un inmueble contra el perfil del prospecto.
// Devuelve 0 si no pasa el filtro duro (tipo o estatus).
export function scoreInmueble(inm: Inmueble, perfil: PerfilProspecto): number {
  if (inm.estatus !== "disponible") return 0;

  const tipoBuscado = (perfil.tipo_buscado || []).map((t) => t.toLowerCase());
  let score = 0;

  // Tipo: filtro duro (+40 si matchea, descarta si no)
  if (tipoBuscado.length === 0 || tipoBuscado.includes(inm.tipo)) {
    score += 40;
  } else {
    return 0;
  }

  // Operación (+15)
  if (
    !perfil.operacion ||
    perfil.operacion === inm.operacion ||
    inm.operacion === "ambas" ||
    perfil.operacion === "ambas"
  ) {
    score += 15;
  }

  // Ciudad (+25)
  const ciudades = (perfil.ciudades || []).map((c) => c.toLowerCase());
  if (
    inm.ciudad &&
    (ciudades.length === 0 ||
      ciudades.some((c) => inm.ciudad!.toLowerCase().includes(c)))
  ) {
    score += 25;
  }

  // Rango de inversión (+20)
  if (perfil.presupuesto && inm.rango_inversion) {
    const r = RANGOS[inm.rango_inversion];
    if (r && perfil.presupuesto >= r.min && perfil.presupuesto <= r.max) {
      score += 20;
    }
  }

  // Objetivo (+15)
  if (perfil.objetivo && inm.objetivo_recomendado.includes(perfil.objetivo)) {
    score += 15;
  }

  return score;
}

// Devuelve los inmuebles ordenados por score, filtrando los que superan el umbral.
export function matchInmuebles(
  inmuebles: Inmueble[],
  perfil: PerfilProspecto,
  umbral = 50,
  max = 4
): Inmueble[] {
  return inmuebles
    .map((inm) => ({ inm, score: scoreInmueble(inm, perfil) }))
    .filter((x) => x.score >= umbral)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.inm);
}

// ROI anual estimado por renta, usando datos de la zona del inmueble.
export function calcularROI(inm: Inmueble): number {
  const m2 = inm.m2_construidos > 0 ? inm.m2_construidos : inm.m2_terreno;
  if (!m2 || !inm.renta_promedio_m2 || !inm.precio_venta) return 0;
  const rentaAnual = m2 * inm.renta_promedio_m2 * 12 * (inm.ocupacion_zona / 100);
  return (rentaAnual / inm.precio_venta) * 100;
}
