import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  logoUrl: string;
  communityHref: string;
  blogHref?: string;
}

export default function StickyHeader({ logoUrl, communityHref, blogHref = "/blog" }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clases base (Bordes gruesos y negrita)
  const btnBase = "flex items-center gap-1.5 text-[10px] md:text-xs font-extrabold px-5 py-2.5 rounded-full uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-sm border-2";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-4 py-3 md:px-6 md:py-4
        ${scrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-pink-200/40 border-b-2 border-pink-100" 
          : "bg-transparent border-transparent pt-6" // Sin fondo negro
        }
      `}
    >
      {/* --- LOGO --- */}
      <div className="flex items-center">
        <a href="/" className="group relative block"> 
            <img
            src={logoUrl}
            alt="Logo"
            className={`h-8 md:h-10 w-auto object-contain transition-all duration-300 
                ${scrolled ? "" : "drop-shadow-lg brightness-0 invert"} 
            `}
            // Filtro Rosa al hacer scroll
            style={scrolled ? {
                filter: "brightness(0) saturate(100%) invert(38%) sepia(63%) saturate(3047%) hue-rotate(302deg) brightness(97%) contrast(96%)"
            } : {}}
            />
        </a>
      </div>

      {/* --- BOTONES --- */}
      <div className="flex items-center gap-3">
        
        {/* Botón BLOG (CORREGIDO: Ahora es Blanco Sólido siempre) */}
        <a
          href={blogHref}
          className={`${btnBase} ${
            scrolled
              // Estado Scroll: Rosa muy clarito
              ? "bg-pink-50 text-pink-500 border-pink-200 hover:bg-pink-500 hover:text-white hover:border-pink-500"
              // Estado Inicial: Blanco Sólido (Sticker) para que se lea bien sobre la foto
              : "bg-white text-pink-600 border-white shadow-lg hover:bg-pink-50 hover:scale-105"
          }`}
        >
          Blog
        </a>

        {/* Botón COMUNIDAD */}
        <a
          href={communityHref}
          target="_blank"
          rel="noreferrer"
          className={`${btnBase} border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 hover:rotate-1`}
        >
          <span className="hidden md:inline">Unirme a la</span> Comunidad
        </a>
      </div>
    </nav>
  );
}