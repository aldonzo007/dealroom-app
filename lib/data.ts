import { getServiceClient } from "./supabase";
import { Cliente, Inmueble, DealRoom } from "./types";

export async function getCliente(slug: string): Promise<Cliente | null> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("clientes")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();
  return data as Cliente | null;
}

export async function getInmuebles(clientId: string): Promise<Inmueble[]> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("inmuebles")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  return (data || []) as Inmueble[];
}

export async function getInmueblesDisponibles(clientId: string): Promise<Inmueble[]> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("inmuebles")
    .select("*")
    .eq("client_id", clientId)
    .eq("estatus", "disponible")
    .order("created_at", { ascending: false });
  return (data || []) as Inmueble[];
}

export async function getInmueble(id: string): Promise<Inmueble | null> {
  const sb = getServiceClient();
  const { data } = await sb.from("inmuebles").select("*").eq("id", id).maybeSingle();
  return data as Inmueble | null;
}

export async function getInmueblesByIds(ids: string[]): Promise<Inmueble[]> {
  if (!ids.length) return [];
  const sb = getServiceClient();
  const { data } = await sb.from("inmuebles").select("*").in("id", ids);
  const rows = (data || []) as Inmueble[];
  // preservar el orden de ids
  return ids.map((id) => rows.find((r) => r.id === id)).filter(Boolean) as Inmueble[];
}

export async function getDealRoom(token: string): Promise<DealRoom | null> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("deal_rooms")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  return data as DealRoom | null;
}

export function generarToken(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}
