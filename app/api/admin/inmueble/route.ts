import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

function auth(req: NextRequest): boolean {
  const pass = process.env.ADMIN_PASSWORD || "";
  if (!pass) return false;
  return req.headers.get("x-admin-pass") === pass;
}

// Crear o actualizar inmueble
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ ok: false, error: "no autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const sb = getServiceClient();
    const { id, ...fields } = body;

    // normalizar arrays que vienen como string separada por saltos de línea
    const toArr = (v: unknown) =>
      Array.isArray(v) ? v : typeof v === "string" ? v.split("\n").map((s) => s.trim()).filter(Boolean) : [];
    if ("fotos" in fields) fields.fotos = toArr(fields.fotos);
    if ("objetivo_recomendado" in fields) fields.objetivo_recomendado = toArr(fields.objetivo_recomendado);

    if (id) {
      const { error } = await sb.from("inmuebles").update(fields).eq("id", id);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, id });
    } else {
      const { data, error } = await sb.from("inmuebles").insert(fields).select("id").maybeSingle();
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, id: data?.id });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const { id } = await req.json();
    const sb = getServiceClient();
    await sb.from("inmuebles").delete().eq("id", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
