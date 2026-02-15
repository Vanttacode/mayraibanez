import React, { useState, useEffect } from "react";

interface Props {
  logoUrl: string;
  communityHref: string;
  blogHref?: string;
}

export default function StickyHeader({ logoUrl, communityHref, blogHref = "/blog" }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clases base para los botones (Glossy y redondeados)
  const btnBase = "text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest border transition-all hover:-translate-y-0.5 active:scale-95";

  return (
    <nav
      className={`absolute top-0 left-0 w-full z-50 transition-all duration-500 px-5 py-4 flex items-center justify-between
        ${scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm rounded-b-[2rem]" 
          : "bg-gradient-to-b from-black/60 to-transparent"
        }
      `}
    >
      {/* --- LOGO --- */}
      <div className="flex items-center">
        <a href="/"> {/* Agregué link al home en el logo por usabilidad */}
            <img
            src={logoUrl}
            alt="Logo"
            className={`h-8 w-auto object-contain transition-all duration-300 
                ${scrolled ? "" : "drop-shadow-md brightness-0 invert"}
            `}
            // Aplicamos el filtro ROSA solo cuando hay scroll
            style={scrolled ? {
                filter: "brightness(0) saturate(100%) invert(38%) sepia(63%) saturate(3047%) hue-rotate(302deg) brightness(97%) contrast(96%)"
            } : {}}
            />
        </a>
      </div>

      {/* --- BOTONES --- */}
      <div className="flex items-center gap-2">
        
        {/* Botón BLOG */}
        <a
          href={blogHref}
          className={`${btnBase} ${
            scrolled
              ? "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900"
              : "bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          Blog
        </a>

        {/* Botón COMUNIDAD (Destacado) */}
        <a
          href={communityHref}
          target="_blank"
          rel="noreferrer"
          className={`${btnBase} bg-gradient-to-r from-rose-500 to-pink-600 text-white border-transparent shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50`}
        >
          Comunidad
        </a>
      </div>
    </nav>
  );
}