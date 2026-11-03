import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { agregarTagsGHL, agregarNotaGHL } from "@/lib/ghl";
import { Cliente } from "@/lib/types";

const PESOS: Record<string, number> = {
  portal_abierto: 10,
  inmueble_visto: 5,
  calculadora_usada: 20,
  pdf_descargado: 15,
  whatsapp_click: 25,
  visita_agendada: 40,
};

const UMBRAL_CALIENTE = 40;

export async function POST(req: NextRequest) {
  try {
    const { token, tipo, inmueble_id, metadata } = await req.json();
    if (!token || !tipo) return NextResponse.json({ ok: false }, { status: 400 });

    const sb = getServiceClient();

    const { data: dr } = await sb
      .from("deal_rooms")
      .select("id, score, veces_abierto, ghl_contact_id, client_id, prospecto_nombre")
      .eq("token", token)
      .maybeSingle();
    if (!dr) return NextResponse.json({ ok: false }, { status: 404 });

    await sb.from("eventos").insert({
      deal_room_id: dr.id,
      tipo,
      inmueble_id: inmueble_id || null,
      metadata: metadata || {},
    });

    const prevScore = dr.score || 0;
    const nuevoScore = prevScore + (PESOS[tipo] || 0);
    const update: Record<string, unknown> = { score: nuevoScore };
    if (tipo === "portal_abierto") {
      update.veces_abierto = (dr.veces_abierto || 0) + 1;
      update.ultimo_abierto = new Date().toISOString();
    }
    if (tipo === "visita_agendada") update.estatus = "agendado";
    await sb.from("deal_rooms").update(update).eq("id", dr.id);

    // CONEXIÓN 2: empujar el calor a GHL (tags que disparan tareas al broker)
    if (dr.ghl_contact_id) {
      const { data: cli } = await sb.from("clientes").select("*").eq("id", dr.client_id).maybeSingle();
      const cliente = cli as Cliente | null;
      if (cliente) {
        const tags: string[] = [];
        // Cruzó el umbral de "caliente" en este evento
        if (prevScore < UMBRAL_CALIENTE && nuevoScore >= UMBRAL_CALIENTE) {
          tags.push("dealroom-caliente");
        }
        if (tipo === "visita_agendada") tags.push("dealroom-agendo");
        if (tipo === "whatsapp_click") tags.push("dealroom-whatsapp");
        if (tipo === "calculadora_usada") tags.push("dealroom-uso-calculadora");

        if (tags.length) await agregarTagsGHL(cliente, dr.ghl_contact_id, tags);
        if (tipo === "visita_agendada") {
          await agregarNotaGHL(cliente, dr.ghl_contact_id, `${dr.prospecto_nombre || "El prospecto"} agendó visita desde su deal room. Score de intención: ${nuevoScore}.`);
        }
      }
    }

    return NextResponse.json({ ok: true, score: nuevoScore });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
