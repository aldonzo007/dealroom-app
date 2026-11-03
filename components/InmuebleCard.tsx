import Link from "next/link";
import { Inmueble, formatMXN, tipoLabel, operacionLabel } from "@/lib/types";

export default function InmuebleCard({ inm, href }: { inm: Inmueble; href: string }) {
  const precio = inm.operacion === "renta"
    ? `${formatMXN(inm.precio_renta)}/mes`
    : formatMXN(inm.precio_venta);

  return (
    <Link href={href} className="group block bg-white border border-navy-900/10 overflow-hidden hover:border-gold transition-colors">
      <div className="aspect-[4/3] overflow-hidden bg-navy-800/5">
        {inm.fotos[0] ? (
          <img src={inm.fotos[0]} alt={inm.nombre_interno} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy-900/30 text-sm">Sin foto</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] tracking-[0.15em] uppercase text-gold-dark">{tipoLabel(inm.tipo)}</span>
          <span className="text-navy-900/30">·</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-navy-900/50">{operacionLabel(inm.operacion)}</span>
        </div>
        <h3 className="serif text-lg text-navy-900 mb-1 leading-snug">{inm.nombre_interno}</h3>
        {(inm.zona || inm.ciudad) && (
          <div className="text-navy-900/50 text-sm mb-3">{[inm.zona, inm.ciudad].filter(Boolean).join(", ")}</div>
        )}
        <div className="serif text-xl text-navy-900 font-medium">{precio}</div>
      </div>
    </Link>
  );
}
