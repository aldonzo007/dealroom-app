"use client";
import { useState } from "react";

export default function DestacadoPhoto({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const total = fotos.length;

  function scrollAnalisis() {
    const el = document.getElementById("analisis");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const foto = fotos[0];
  return (
    <>
      <div className="absolute inset-0">
        {foto ? (
          <button type="button" onClick={() => { setI(0); setOpen(true); }} className="absolute inset-0 group">
            <img src={foto} alt={alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur text-navy-900 text-[11px] font-medium tracking-[0.2em] uppercase px-3 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
              Ver {total} {total === 1 ? "foto" : "fotos"}
            </div>
            {total > 1 && (
              <div className="absolute top-4 right-4 bg-navy-900/70 backdrop-blur text-white text-xs px-2.5 py-1 rounded font-medium">+{total - 1}</div>
            )}
          </button>
        ) : (
          <div className="absolute inset-0 bg-navy-900/5 flex items-center justify-center text-navy-900/30 text-sm">Sin foto</div>
        )}
      </div>

      <button
        type="button"
        onClick={scrollAnalisis}
        className="absolute bottom-4 left-4 bg-white text-navy-900 text-xs font-semibold px-4 py-2.5 rounded-md shadow-lg hover:bg-cream transition-colors flex items-center gap-1.5"
      >
        Más información
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
      </button>

      {open && foto && (
        <div className="fixed inset-0 bg-navy-900/95 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <button className="absolute top-6 right-6 text-white text-3xl hover:text-gold w-10 h-10 flex items-center justify-center" onClick={() => setOpen(false)}>×</button>
          <img src={fotos[i]} alt="" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setI((i - 1 + total) % total); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center rounded-full"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setI((i + 1) % total); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center rounded-full"
              >
                ›
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">{i + 1} / {total}</div>
            </>
          )}
        </div>
      )}
    </>
  );
}
