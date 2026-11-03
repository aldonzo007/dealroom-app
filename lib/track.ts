// Helper client-side para mandar eventos de engagement al server.
// Fire-and-forget: no bloquea la UI.
import { TipoEvento } from "./types";

export function track(
  token: string,
  tipo: TipoEvento,
  inmuebleId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const body = JSON.stringify({ token, tipo, inmueble_id: inmuebleId, metadata });
    // sendBeacon sobrevive a navegación/cierre de pestaña
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // tracking nunca rompe la experiencia
  }
}
