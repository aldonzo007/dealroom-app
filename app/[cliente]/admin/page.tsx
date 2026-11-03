import { notFound } from "next/navigation";
import { getCliente, getInmuebles } from "@/lib/data";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: Promise<{ cliente: string }> }) {
  const { cliente: slug } = await params;
  const cliente = await getCliente(slug);
  if (!cliente) notFound();
  const inmuebles = await getInmuebles(cliente.id);
  return <AdminPanel cliente={cliente} inmuebles={inmuebles} />;
}
