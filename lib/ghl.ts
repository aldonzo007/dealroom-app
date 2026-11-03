import { Cliente, PerfilProspecto, tipoLabel } from "./types";

const BASE = "https://services.leadconnectorhq.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
}

// Resumen legible del perfil, para guardarlo como nota en el contacto.
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

// Crea o actualiza el contacto en GHL. Devuelve el contactId o null.
export async function upsertContactoGHL(
  cliente: Cliente,
  data: { nombre?: string; email?: string; whatsapp?: string; perfil: PerfilProspecto; dealRoomUrl: string }
): Promise<string | null> {
  if (!cliente.ghl_token || !cliente.ghl_location_id) return null;
  try {
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
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const contactId = json?.contact?.id || json?.id;
    if (!contactId) return null;

    // Nota con el perfil + link al deal room (robusto, el broker lo lee directo)
    await fetch(`${BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ body: `Nuevo prospecto DealRoom.\n${resumenPerfil(data.perfil)}\n\nPortal: ${data.dealRoomUrl}` }),
    }).catch(() => {});

    return contactId;
  } catch {
    return null;
  }
}

// Agrega tags al contacto (dispara workflows en GHL, ej. tarea al broker).
export async function agregarTagsGHL(cliente: Cliente, contactId: string, tags: string[]) {
  if (!cliente.ghl_token) return;
  try {
    await fetch(`${BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ tags }),
    });
  } catch {
    // no bloquea
  }
}

// Agrega una nota al contacto (ej. "agendó visita").
export async function agregarNotaGHL(cliente: Cliente, contactId: string, body: string) {
  if (!cliente.ghl_token) return;
  try {
    await fetch(`${BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: headers(cliente.ghl_token),
      body: JSON.stringify({ body }),
    });
  } catch {
    // no bloquea
  }
}
