import React, { useState, useEffect } from "react";

interface Props {
  logoUrl: string;
  communityHref: string;
}

export default function StickyHeader({ logoUrl, communityHref }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`absolute top-0 left-0 w-full z-50 transition-all duration-500 px-5 py-4 flex items-center justify-between
        ${scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm rounded-b-2xl" 
          : "bg-gradient-to-b from-black/60 to-transparent"
        }
      `}
    >
      {/* Logo a la izquierda */}
      <div className="flex items-center">
        <img 
          src={logoUrl} 
          alt="Logo" 
          // Aplicamos el filtro ROSA cuando hay scroll, si no, BLANCO puro
          className={`h-8 w-auto object-contain transition-all duration-300 
            ${scrolled 
              ? "filter brightness-0 saturate-100 invert-38 sepia-63 saturate-3047 hue-rotate-302 brightness-97 contrast-96" 
              : "drop-shadow-md brightness-0 invert" 
            }`}
            style={scrolled ? {
                filter: "brightness(0) saturate(100%) invert(38%) sepia(63%) saturate(3047%) hue-rotate(302deg) brightness(97%) contrast(96%)"
            } : {}}
        />
      </div>

      {/* Botones de Acción a la derecha - SOLO COMUNIDAD */}
      <div className="flex items-center gap-2">
        <a
          href={communityHref}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] font-bold px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:scale-105 transition-transform uppercase tracking-wide border border-white/20"
        >
          Comunidad
        </a>
      </div>
    </nav>
  );
}