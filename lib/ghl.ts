import { Cliente, PerfilProspecto, tipoLabel, formatMXN } from "./types";

const BASE = "https://services.leadconnectorhq.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
}

// Normaliza un nombre: minúsculas, sin acentos, espacios/underscores/guiones → espacio simple
function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[_\-\s]+/g, " ")
    .trim();
}

// Cache en memoria de los custom fields del location: nombre normalizado -> fieldId
const fieldsCache: Record<string, Record<string, string>> = {};

async function loadCustomFields(cliente: Cliente): Promise<Record<string, string>> {
  const loc = cliente.ghl_location_id!;
  if (loc in fieldsCache) return fieldsCache[loc];
  const map: Record<string, string> = {};
  try {
    const res = await fetch(`${BASE}/locations/${loc}/customFields`, {
      headers: headers(cliente.ghl_token!),
    });
    if (!res.ok) { fieldsCache[loc] = map; return map; }
    const json = await res.json();
    const fields = json?.customFields || [];
    for (const f of fields) {
      if (f?.id && f?.name) map[norm(f.name)] = f.id;
      if (f?.id && f?.fieldKey) map[norm(f.fieldKey.replace(/^contact\./, ""))] = f.id;
    }
  } catch {}
  fieldsCache[loc] = map;
  return map;
}

// Busca el fieldId probando varios nombres posibles
function findFieldId(fields: Record<string, string>, nombres: string[]): string | null {
  for (const n of nombres) {
    const id = fields[norm(n)];
    if (id) return id;
  }
  return null;
}

async function getDealRoomFieldId(cliente: Cliente): Promise<string | null> {
  const fields = await loadCustomFields(cliente);
  return findFieldId(fields, ["Deal Room URL", "DealRoom URL", "deal_room_url", "url del deal room"]);
}

function resumenPerfil(perfil: PerfilProspecto): string {
  const tipos = (perfil.tipo_buscado || []).map((t) => tipoLabel(t as any)).join(", ");
  const partes = [
    tipos && `Busca: ${tipos}`,
    perfil.operacion && `Operación: ${perfil.operacion}`,
    perfil.objetivo && `Objetivo: ${perfil.objetivo}`,
    perfil.presupuesto && `Presupuesto: $${perfil.presupuesto.toLocaleString("es-MX")}`,
    (perfil.ciudades || []).length && `Ciudades: ${(perfil.ciudades || []).join(", ")}`,
    perfil.timing && `Timing: ${perfil.timing}`,
  ].filter(Boolean);
  return partes.join(" · ");
}

export async function upsertContactoGHL(
  cliente: Cliente,
  data: {
    nombre?: string; email?: string; whatsapp?: string;
    perfil: PerfilProspecto; dealRoomUrl: string;
    inmuebles: { nombre: string; precio: number }[];
  }
): Promise<string | null> {
  if (!cliente.ghl_token || !cliente.ghl_location_id) return null;
  try {
    // Cargar TODOS los custom fields del location y armar el mapeo completo
    const fields = await loadCustomFields(cliente);
    const p = data.perfil || {};

    const tipoBuscadoStr = (p.tipo_buscado || []).map((t) => tipoLabel(t as never)).join(", ");
    const ciudadesStr = (p.ciudades || []).join(", ");
    const inmueblesStr = data.inmuebles.length
      ? data.inmuebles.map((i) => `${i.nombre} (${formatMXN(i.precio)})`).join(" | ")
      : "Sin coincidencias automáticas";

    const campos: { nombres: string[]; value: unknown }[] = [
      { nombres: ["Deal Room URL", "DealRoom URL", "deal_room_url"], value: data.dealRoomUrl },
      { nombres: ["Tipo buscado", "Tipo de inmueble", "tipo_buscado", "tipo"], value: tipoBuscadoStr },
      { nombres: ["Operacion", "Operación", "operacion"], value: p.operacion || "" },
      { nombres: ["Objetivo", "objetivo"], value: p.objetivo || "" },
      { nombres: ["Presupuesto", "presupuesto"], value: p.presupuesto || "" },
      { nombres: ["Ciudades", "Zona", "Ciudad", "ciudades"], value: ciudadesStr },
      { nombres: ["Timing", "Urgencia", "timing"], value: p.timing || "" },
      { nombres: ["Forma de pago", "forma_pago"], value: p.forma_pago || "" },
      { nombres: ["Inmuebles sugeridos", "Inmuebles matcheados", "inmuebles"], value: inmueblesStr },
      { nombres: ["Total matches", "Matches", "num_matches"], value: data.inmuebles.length },
      { nombres: ["Resumen perfil", "resumen_perfil"], value: resumenPerfil(p) },
    ];

    const customFields: { id: string; field_value: unknown }[] = [];
    for (const c of campos) {
      const id = findFieldId(fields, c.nombres);
      if (id && c.value !== undefined && c.value !== null && c.value !== "") {
        customFields.push({ id, field_value: c.value });
      }
    }

    const res = await fetch(`${BASE}/contacts/upsert`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({
        locationId: cliente.ghl_location_id,
        firstName: data.nombre || "Prospecto",
        email: data.email || undefined,
        phone: data.whatsapp || undefined,
        tags: ["dealroom-prospecto"],
        source: "DealRoom portal",
        customFields: customFields.length ? customFields : undefined,
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const contactId = json?.contact?.id || json?.id;
    if (!contactId) return null;

    // Nota con perfil + inmuebles matcheados + link (el broker lo lee directo)
    const listaInmuebles = data.inmuebles.length
      ? data.inmuebles.map((i) => `- ${i.nombre} (${formatMXN(i.precio)})`).join("\n")
      : "- Sin coincidencias automáticas (requiere selección manual del broker)";
    const nota = `Nuevo prospecto DealRoom.\n\nPerfil: ${resumenPerfil(data.perfil)}\n\nInmuebles sugeridos:\n${listaInmuebles}\n\nDeal room: ${data.dealRoomUrl}`;

    await fetch(`${BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ body: nota }),
    }).catch(() => {});

    return contactId;
  } catch {
    return null;
  }
}

// Escribe la URL del deal room en el campo "Deal Room URL" de un contacto existente.
export async function escribirDealRoomUrl(cliente: Cliente, contactId: string, url: string): Promise<boolean> {
  if (!cliente.ghl_token) return false;
  try {
    const fieldId = await getDealRoomFieldId(cliente);
    if (!fieldId) return false;
    const res = await fetch(`${BASE}/contacts/${contactId}`, {
      method: "PUT",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ customFields: [{ id: fieldId, field_value: url }] }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function agregarTagsGHL(cliente: Cliente, contactId: string, tags: string[]) {
  if (!cliente.ghl_token) return;
  try {
    await fetch(`${BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ tags }),
    });
  } catch {}
}

export async function agregarNotaGHL(cliente: Cliente, contactId: string, body: string) {
  if (!cliente.ghl_token) return;
  try {
    await fetch(`${BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ body }),
    });
  } catch {}
}
