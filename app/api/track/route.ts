import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// Pesos de cada señal para el score de intención
const PESOS: Record<string, number> = {
  portal_abierto: 10,
  inmueble_visto: 5,
  calculadora_usada: 20,
  pdf_descargado: 15,
  whatsapp_click: 25,
  visita_agendada: 40,
};

export async function POST(req: NextRequest) {
  try {
    const { token, tipo, inmueble_id, metadata } = await req.json();
    if (!token || !tipo) return NextResponse.json({ ok: false }, { status: 400 });

    const sb = getServiceClient();

    const { data: dr } = await sb
      .from("deal_rooms")
      .select("id, score, veces_abierto")
      .eq("token", token)
      .maybeSingle();
    if (!dr) return NextResponse.json({ ok: false }, { status: 404 });

    // Registrar el evento
    await sb.from("eventos").insert({
      deal_room_id: dr.id,
      tipo,
      inmueble_id: inmueble_id || null,
      metadata: metadata || {},
    });

    // Actualizar score y contadores del deal room
    const nuevoScore = (dr.score || 0) + (PESOS[tipo] || 0);
    const update: Record<string, unknown> = { score: nuevoScore };
    if (tipo === "portal_abierto") {
      update.veces_abierto = (dr.veces_abierto || 0) + 1;
      update.ultimo_abierto = new Date().toISOString();
    }
    if (tipo === "visita_agendada") update.estatus = "agendado";

    await sb.from("deal_rooms").update(update).eq("id", dr.id);

    // TODO fase siguiente: empujar score/señal a GHL (actualizar contacto, disparar tarea al broker)

    return NextResponse.json({ ok: true, score: nuevoScore });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
