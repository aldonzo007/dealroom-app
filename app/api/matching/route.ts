import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getCliente, getInmueblesDisponibles, generarToken } from "@/lib/data";
import { matchInmuebles } from "@/lib/matching";
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

    // Matching contra el catálogo del cliente
    const inmuebles = await getInmueblesDisponibles(cliente.id);
    const matches = matchInmuebles(inmuebles, perfil);

    const sb = getServiceClient();
    const token = generarToken();

    // Crear el deal room (persiste el match para que el prospecto pueda volver)
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

    // TODO fase siguiente: crear contacto en GHL + disparar workflow de envío de link + notificar al broker

    return NextResponse.json({ ok: true, token, matched_count: matches.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
