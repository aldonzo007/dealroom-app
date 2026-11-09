import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

function auth(req: NextRequest): boolean {
  const pass = process.env.ADMIN_PASSWORD || "";
  if (!pass) return false;
  return req.headers.get("x-admin-pass") === pass;
}

const CAMPOS_PERMITIDOS = [
  "nombre",
  "logo_url",
  "color_primario",
  "hero_frase",
  "broker_nombre",
  "broker_titulo",
  "broker_foto_url",
  "broker_whatsapp",
  "broker_calendar_url",
  "broker_email",
  "calendar_url",
];

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ ok: false, error: "no autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ ok: false, error: "falta id del cliente" }, { status: 400 });
    const fields: Record<string, unknown> = {};
    for (const k of CAMPOS_PERMITIDOS) {
      if (k in rest) fields[k] = rest[k];
    }
    const sb = getServiceClient();
    const { error } = await sb.from("clientes").update(fields).eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
