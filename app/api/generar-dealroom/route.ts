import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getCliente, getInmueblesDisponibles, generarToken } from "@/lib/data";
import { matchInmuebles } from "@/lib/matching";
import { escribirDealRoomUrl, agregarNotaGHL } from "@/lib/ghl";
import { PerfilProspecto, formatMXN } from "@/lib/types";

// Convierte "Bodega industrial" -> "bodega_industrial" (quita acentos, espacios -> _)
function slug(v: string): string {
  return (v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

function toArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String);
  return String(v).split(",").map((s) => s.trim()).filter(Boolean);
}

// Endpoint que usa el AGENTE de GHL: recibe un contacto que YA existe en GHL,
// genera su deal room y escribe la URL de vuelta en el contacto.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // GHL puede mandar el custom data al nivel raíz o anidado; buscamos en ambos
    const cd = body.customData || body.custom_data || {};
    const g = (k: string) => {
      const v = body[k] ?? cd[k];
      return typeof v === "string" ? v.trim() : v;
    };

    const cliente_slug = g("cliente_slug");
    const contact_id = g("contact_id");
    const nombre = g("nombre");
    const tipo_buscado = g("tipo_buscado");
    const operacion = g("operacion");
    const objetivo = g("objetivo");
    const presupuesto = g("presupuesto");
    const ciudades = g("ciudades");
    const timing = g("timing");

    const cliente = cliente_slug ? await getCliente(cliente_slug) : null;
    if (!cliente) {
      return NextResponse.json({
        ok: false,
        error: "cliente no encontrado",
        slug_recibido: cliente_slug ?? null,
        llaves_recibidas: Object.keys(body),
      }, { status: 404 });
    }
    if (!contact_id) return NextResponse.json({ ok: false, error: "falta contact_id" }, { status: 400 });

    // Normalizar el perfil como venga de GHL
    const perfil: PerfilProspecto = {
      tipo_buscado: toArray(tipo_buscado).map(slug),
      operacion: operacion ? slug(operacion) : undefined,
      objetivo: objetivo ? slug(objetivo) : undefined,
      presupuesto: presupuesto ? parseFloat(String(presupuesto).replace(/[^\d.]/g, "")) : undefined,
      ciudades: toArray(ciudades),
      timing: timing ? String(timing) : undefined,
    };

    const inmuebles = await getInmueblesDisponibles(cliente.id);
    const matches = matchInmuebles(inmuebles, perfil);

    const sb = getServiceClient();
    const token = generarToken();

    const { error } = await sb.from("deal_rooms").insert({
      token,
      client_id: cliente.id,
      ghl_contact_id: contact_id,
      prospecto_nombre: nombre || null,
      perfil,
      inmueble_ids: matches.map((m) => m.id),
      estatus: "activo",
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
    const url = `${origin}/${cliente_slug}/d/${token}`;

    // Escribir la URL de vuelta en el contacto de GHL (para que el agente la mande)
    await escribirDealRoomUrl(cliente, contact_id, url);

    // Nota con los inmuebles sugeridos
    const lista = matches.length
      ? matches.map((m) => `- ${m.nombre_interno} (${formatMXN(m.precio_venta)})`).join("\n")
      : "- Sin coincidencias automáticas";
    await agregarNotaGHL(cliente, contact_id, `Deal room generado por el agente.\n\nInmuebles sugeridos:\n${lista}\n\nPortal: ${url}`);

    return NextResponse.json({ ok: true, token, url, matched_count: matches.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
