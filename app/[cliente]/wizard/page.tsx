import { notFound } from "next/navigation";
import { getCliente } from "@/lib/data";
import Wizard from "@/components/Wizard";

export default async function WizardPage({ params }: { params: Promise<{ cliente: string }> }) {
  const { cliente: slug } = await params;
  const cliente = await getCliente(slug);
  if (!cliente) notFound();
  return <Wizard slug={slug} colorPrimario={cliente.color_primario} />;
}
