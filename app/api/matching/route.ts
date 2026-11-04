import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getCliente, getInmueblesDisponibles, generarToken } from "@/lib/data";
import { matchInmuebles } from "@/lib/matching";
import { upsertContactoGHL } from "@/lib/ghl";
import { PerfilProspecto } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cliente_slug, perfil, nombre, email, whatsapp } = body as {
      cliente_slug: string;
      perfil: PerfilProspecto;
      nombre?: string;
      email?: string;
      whatsapp?: string;
    };

    const cliente = await getCliente(cliente_slug);
    if (!cliente) return NextResponse.json({ ok: false, error: "cliente no encontrado" }, { status: 404 });

    const inmuebles = await getInmueblesDisponibles(cliente.id);
    const matches = matchInmuebles(inmuebles, perfil);

    const sb = getServiceClient();
    const token = generarToken();

    const { error } = await sb.from("deal_rooms").insert({
      token,
      client_id: cliente.id,
      prospecto_nombre: nombre || null,
      prospecto_email: email || null,
      prospecto_whatsapp: whatsapp || null,
      perfil: perfil || {},
      inmueble_ids: matches.map((m) => m.id),
      estatus: "activo",
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    // CONEXIÓN 1: crear contacto en GHL (no bloquea la experiencia del prospecto)
    try {
      const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
      const dealRoomUrl = `${origin}/${cliente_slug}/d/${token}`;
      const contactId = await upsertContactoGHL(cliente, {
        nombre, email, whatsapp, perfil, dealRoomUrl,
        inmuebles: matches.map((m) => ({ nombre: m.nombre_interno, precio: m.precio_venta })),
      });
      if (contactId) {
        await sb.from("deal_rooms").update({ ghl_contact_id: contactId }).eq("token", token);
      }
    } catch {
      // si GHL falla, el prospecto igual ve su deal room
    }

    return NextResponse.json({ ok: true, token, matched_count: matches.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
