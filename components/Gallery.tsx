"use client";
import { useState } from "react";

export default function Gallery({ fotos }: { fotos: string[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!fotos.length) {
    return (
      <div className="aspect-[4/3] bg-navy-800/10 flex items-center justify-center">
        <span className="text-navy-900/40 text-sm">Sin imágenes disponibles</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setLightbox(true)}
          className="block w-full aspect-[4/3] overflow-hidden group relative"
        >
          <img src={fotos[active]} alt="Propiedad" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute bottom-4 left-4 bg-navy-900/90 text-white text-xs px-3 py-1.5 tracking-wider">
            VER EN PANTALLA COMPLETA
          </div>
        </button>

        {fotos.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {fotos.slice(0, 4).map((foto, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden ${active === i ? "ring-2 ring-gold" : "opacity-60 hover:opacity-100"}`}
              >
                <img src={foto} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-navy-900/95 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-6 right-6 text-white text-3xl hover:text-gold" onClick={() => setLightbox(false)}>×</button>
          <img src={fotos[active]} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </>
  );
}
