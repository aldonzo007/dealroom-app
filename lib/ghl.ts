import { Cliente, PerfilProspecto, tipoLabel, formatMXN } from "./types";

const BASE = "https://services.leadconnectorhq.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
}

// Cache en memoria del id del campo "Deal Room URL" por location.
const fieldIdCache: Record<string, string | null> = {};

async function getDealRoomFieldId(cliente: Cliente): Promise<string | null> {
  const loc = cliente.ghl_location_id!;
  if (loc in fieldIdCache) return fieldIdCache[loc];
  try {
    const res = await fetch(`${BASE}/locations/${loc}/customFields`, {
      headers: headers(cliente.ghl_token!),
    });
    if (!res.ok) { fieldIdCache[loc] = null; return null; }
    const json = await res.json();
    const fields = json?.customFields || [];
    const match = fields.find((f: any) => {
      const n = (f.name || "").toLowerCase();
      const k = (f.fieldKey || "").toLowerCase();
      return n === "deal room url" || k.includes("deal_room_url");
    });
    fieldIdCache[loc] = match?.id || null;
    return fieldIdCache[loc];
  } catch {
    fieldIdCache[loc] = null;
    return null;
  }
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
    // Guardar el link del deal room en el campo del contacto (si existe)
    const fieldId = await getDealRoomFieldId(cliente);
    const customFields = fieldId ? [{ id: fieldId, field_value: data.dealRoomUrl }] : undefined;

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
        customFields,
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
