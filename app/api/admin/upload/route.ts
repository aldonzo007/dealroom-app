import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

function auth(req: NextRequest): boolean {
  const pass = process.env.ADMIN_PASSWORD || "";
  if (!pass) return false;
  return req.headers.get("x-admin-pass") === pass;
}

// Sube archivos (fotos o PDF) a Supabase Storage y devuelve sus URLs públicas.
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ ok: false, error: "no autorizado" }, { status: 401 });
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    if (!files.length) return NextResponse.json({ ok: false, error: "sin archivos" }, { status: 400 });

    const sb = getServiceClient();
    const urls: string[] = [];

    for (const file of files) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error } = await sb.storage.from("inmuebles").upload(path, buffer, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      const { data } = sb.storage.from("inmuebles").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return NextResponse.json({ ok: true, urls });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
