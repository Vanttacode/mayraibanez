import React from "react";
import type { SocialLink } from "@/lib/types";
import { Facebook, Twitter, MessageCircle, Music2, Video, Linkedin, Globe } from "lucide-react";

// Mapeo de iconos
function getIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("tiktok")) return <Music2 size={22} />;
  if (p.includes("facebook")) return <Facebook size={22} />;
  if (p.includes("threads")) return <MessageCircle size={22} />;
  if (p === "x" || p.includes("twitter")) return <Twitter size={22} />;
  if (p.includes("youtube")) return <Video size={22} />;
  if (p.includes("linkedin")) return <Linkedin size={22} />;
  return <Globe size={22} />;
}

export default function SocialGrid({ socials }: { socials: SocialLink[] }) {
  
  // 1. FILTRO: Sacamos Email e Instagram porque ya tienen sus propios lugares destacados
  const filteredSocials = socials.filter((s) => {
    const p = s.platform.toLowerCase();
    return !p.includes("mail") && !p.includes("email") && !p.includes("instagram");
  });

  return (
    /* Usamos grid-cols-2 para que los botones sean grandes y fáciles de tocar */
    <div className="mt-2 grid grid-cols-2 gap-3">
      {filteredSocials.map((s) => (
        <a
          key={s.id}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="
            group relative flex items-center gap-3 rounded-2xl p-4
            bg-white border border-rose-100 shadow-sm
            hover:shadow-lg hover:shadow-rose-100/60 hover:border-rose-300 hover:-translate-y-1
            transition-all duration-300 overflow-hidden
          "
        >
          {/* Fondo gradiente sutil al hacer hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icono: Ahora más grande y con fondo propio */}
          <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 shadow-inner">
            {getIcon(s.platform)}
          </div>

          {/* Texto: Más limpio, sin subtítulos innecesarios */}
          <div className="relative z-10 min-w-0 flex-1">
            <div className="text-sm font-bold text-neutral-700 leading-tight group-hover:text-rose-600 transition-colors">
              {s.label}
            </div>
            <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider group-hover:text-rose-400/80 transition-colors">
              Seguir
            </div>
          </div>
          
          {/* Flecha decorativa que aparece */}
          <div className="relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-rose-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </a>
      ))}
    </div>
  );
}