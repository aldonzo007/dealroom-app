"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";
import { TipoEvento } from "@/lib/types";

// Dispara portal_abierto (y opcionalmente inmueble_visto del destacado) al cargar el deal room.
export function PortalTracker({ token, inmuebleId }: { token: string; inmuebleId?: string }) {
  useEffect(() => {
    track(token, "portal_abierto");
    if (inmuebleId) track(token, "inmueble_visto", inmuebleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// Link que registra un evento al hacer click (PDF, WhatsApp, agendar).
export function TrackedLink({
  token, tipo, inmuebleId, href, className, children, external, style,
}: {
  token: string; tipo: TipoEvento; inmuebleId?: string; href: string;
  className?: string; children: React.ReactNode; external?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={className}
      style={style}
      onClick={() => track(token, tipo, inmuebleId)}
    >
      {children}
    </a>
  );
}
