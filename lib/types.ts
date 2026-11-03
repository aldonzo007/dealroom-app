export type TipoInmueble =
  | "terreno"
  | "bodega_industrial"
  | "nave_industrial"
  | "oficina"
  | "local_comercial"
  | "casa"
  | "departamento"
  | "edificio";

export type Operacion = "venta" | "renta" | "ambas";

export interface Cliente {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  color_primario: string;
  broker_nombre: string | null;
  broker_whatsapp: string | null;
  ghl_location_id: string | null;
  calendar_url: string | null;
  activo: boolean;
}

export interface Inmueble {
  id: string;
  client_id: string;
  nombre_interno: string;
  tipo: TipoInmueble;
  operacion: Operacion;
  estatus: string;
  ciudad: string | null;
  zona: string | null;
  direccion: string | null;
  maps_link: string | null;
  m2_construidos: number;
  m2_terreno: number;
  ano_construccion: string | null;
  altura_libre: number;
  andenes: number;
  cajones: number;
  banos: number;
  recamaras: number;
  precio_venta: number;
  precio_renta: number;
  rango_inversion: string | null;
  objetivo_recomendado: string[];
  renta_promedio_m2: number;
  ocupacion_zona: number;
  plusvalia_anual: number;
  fotos: string[];
  pdf_ficha: string | null;
  video_tour: string | null;
  broker_nombre: string | null;
  broker_whatsapp: string | null;
  comision: number;
}

export interface PerfilProspecto {
  tipo_buscado?: string[];
  operacion?: string;
  objetivo?: string;
  presupuesto?: number;
  ciudades?: string[];
  timing?: string;
  forma_pago?: string;
}

export interface DealRoom {
  id: string;
  token: string;
  client_id: string;
  ghl_contact_id: string | null;
  prospecto_nombre: string | null;
  prospecto_email: string | null;
  prospecto_whatsapp: string | null;
  perfil: PerfilProspecto;
  inmueble_ids: string[];
  score: number;
  veces_abierto: number;
  ultimo_abierto: string | null;
  estatus: string;
}

export type TipoEvento =
  | "portal_abierto"
  | "inmueble_visto"
  | "calculadora_usada"
  | "pdf_descargado"
  | "visita_agendada"
  | "whatsapp_click";

export function formatMXN(n: number): string {
  if (!n) return "A consultar";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

export function tipoLabel(tipo: TipoInmueble): string {
  const labels: Record<TipoInmueble, string> = {
    terreno: "Terreno",
    bodega_industrial: "Bodega Industrial",
    nave_industrial: "Nave Industrial",
    oficina: "Oficina Corporativa",
    local_comercial: "Local Comercial",
    casa: "Casa Residencial",
    departamento: "Departamento",
    edificio: "Edificio",
  };
  return labels[tipo] || "Propiedad";
}

export function operacionLabel(op: Operacion): string {
  if (op === "renta") return "Renta";
  if (op === "ambas") return "Venta o Renta";
  return "Venta";
}
