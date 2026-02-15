import React from "react";
import type { SocialLink } from "@/lib/types";
import { Facebook, Twitter, MessageCircle, Music2, Video, Linkedin, Globe, ArrowUpRight } from "lucide-react";

// Mapeo de iconos
function getIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("tiktok")) return <Music2 size={20} />;
  if (p.includes("facebook")) return <Facebook size={20} />;
  if (p.includes("threads")) return <MessageCircle size={20} />;
  if (p === "x" || p.includes("twitter")) return <Twitter size={20} />;
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
            group relative flex items-center gap-3 p-4 rounded-[1.5rem]
            bg-white border border-rose-100 shadow-lg shadow-rose-50
            hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-300 hover:-translate-y-1
            transition-all duration-300 overflow-hidden
          "
        >
          {/* Fondo sutil al hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Icono con fondo circular */}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm border border-rose-100/50">
            {getIcon(s.platform)}
          </div>

          {/* Textos */}
          <div className="relative z-10 min-w-0 flex-1 flex flex-col justify-center">
            <span className="text-sm font-bold text-neutral-700 leading-none group-hover:text-rose-600 transition-colors">
              {s.label}
            </span>
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mt-1 group-hover:text-rose-400 transition-colors">
              Seguir
            </span>
          </div>
          
          {/* Flecha decorativa (animación de entrada) */}
          <div className="relative z-10 text-rose-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
            <ArrowUpRight size={18} />
          </div>
        </a>
      ))}
    </div>
  );
}