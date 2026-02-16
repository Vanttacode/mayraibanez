import React from "react";
import type { SocialLink } from "@/lib/types";
import { Facebook, MessageCircle, Music2, Video, Linkedin, Globe, ArrowUpRight } from "lucide-react";

// Icono X (Twitter) Custom para consistencia
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h.001Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Mapeo de iconos
function getIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("tiktok")) return <Music2 size={20} />;
  if (p.includes("facebook")) return <Facebook size={20} />;
  if (p.includes("threads")) return <MessageCircle size={20} />;
  // Ahora usamos el icono X correcto
  if (p === "x" || p.includes("twitter")) return <XIcon size={18} />;
  if (p.includes("youtube")) return <Video size={20} />;
  if (p.includes("linkedin")) return <Linkedin size={20} />;
  return <Globe size={20} />;
}

export default function SocialGrid({ socials }: { socials: SocialLink[] }) {
  
  // 1. FILTRO: Sacamos Email e Instagram (tienen sus propios CTA gigantes)
  const filteredSocials = socials.filter((s) => {
    const p = s.platform.toLowerCase();
    return !p.includes("mail") && !p.includes("email") && !p.includes("instagram");
  });

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {filteredSocials.map((s) => (
        <a
          key={s.id}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="
            group relative flex items-center gap-3 p-4 rounded-[2rem]
            bg-white border-2 border-pink-100 shadow-lg shadow-pink-100
            hover:shadow-xl hover:shadow-pink-200/60 hover:border-pink-300 hover:-translate-y-1
            transition-all duration-300 overflow-hidden
          "
        >
          {/* Fondo sutil al hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Icono con fondo circular (Estilo Sticker) */}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 shadow-sm border-2 border-pink-100">
            {getIcon(s.platform)}
          </div>

          {/* Textos */}
          <div className="relative z-10 min-w-0 flex-1 flex flex-col justify-center">
            <span className="text-sm font-bold text-neutral-700 leading-none group-hover:text-pink-600 transition-colors">
              {s.label}
            </span>
            <span className="text-[10px] font-extrabold text-pink-300 uppercase tracking-wider mt-1 group-hover:text-pink-400 transition-colors">
              Seguir
            </span>
          </div>
          
          {/* Flecha decorativa (animación de entrada) */}
          <div className="relative z-10 text-pink-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
            <ArrowUpRight size={20} strokeWidth={2.5} />
          </div>
        </a>
      ))}
    </div>
  );
}