import React from "react";
import { User } from "lucide-react";

interface Props {
  src?: string | null;
  alt: string;
}

export default function ProfileAvatar({ src, alt }: Props) {
  return (
    <div className="relative group cursor-pointer z-30 inline-block">
      
      {/* 1. Halo de luz animado (Glow difuso) */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 rounded-full opacity-30 blur-2xl group-hover:opacity-50 group-hover:blur-3xl transition-all duration-700"></div>

      {/* 2. Anillo decorativo externo (gradiente sutil) */}
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-rose-200 to-white opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* 3. Contenedor principal */}
      {/* Ajusté a w-40/w-48. w-52 a veces es demasiado invasivo en pantallas medianas */}
      <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-white border-[4px] border-white shadow-2xl shadow-rose-900/20 overflow-hidden ring-1 ring-rose-50">
        {src ? (
          <img
            src={src}
            alt={alt}
            // CLAVE: Esto hace que cargue instantáneo (mejora el SEO y la UX)
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-[1500ms] ease-in-out"
          />
        ) : (
          // Placeholder elegante en vez de un "?"
          <div className="w-full h-full bg-rose-50 flex items-center justify-center text-rose-300 animate-pulse">
            <User size={64} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}