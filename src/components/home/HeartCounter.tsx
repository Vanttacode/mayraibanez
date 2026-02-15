import { useState, useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@supabase/supabase-js";
// Asegúrate que esta ruta sea correcta en tu proyecto
import { SITE_HANDLE } from "@/lib/site"; 

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface Props {
  initialLikes?: number;
}

export default function HeartCounter({ initialLikes = 0 }: Props) {
  const [count, setCount] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Cargar likes reales al montar
  useEffect(() => {
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("likes")
        .eq("handle", SITE_HANDLE) 
        .single();
      
      if (data) {
        setCount(data.likes || 0);
      }
    };
    fetchLikes();
  }, []);

  const triggerConfetti = () => {
    const scalar = 2;
    const heart = confetti.shapeFromPath({ path: 'M16.7 5.3a5.3 5.3 0 0 0-7.5 0l-.9.9-.8-.9a5.3 5.3 0 0 0-7.5 7.5L8.3 21l8.3-8.3a5.3 5.3 0 0 0 0-7.4z' });

    confetti({
      particleCount: 30,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#ec4899', '#f472b6', '#ffd700'], // Rosas y Oro
      shapes: [heart, 'circle'], // Formas de corazón y círculos
      scalar: 1.2,
      disableForReducedMotion: true,
      ticks: 200 // Duran un poco más en el aire
    });
  };

  const handleLike = async () => {
    if (liked) return; 

    // 1. Feedback Inmediato
    setCount((prev) => prev + 1);
    setLiked(true);
    setAnimating(true);
    triggerConfetti();

    // 2. Guardar en DB
    try {
      // Llamamos a la función segura de base de datos
      await supabase.rpc("increment_likes", { p_handle: SITE_HANDLE });
    } catch (error) {
      console.error("Error al dar like:", error);
    }

    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`
        group relative flex items-center gap-3 px-6 py-3 rounded-full 
        transition-all duration-500 transform
        ${liked 
          ? "bg-gradient-to-r from-rose-50 to-white border border-rose-200 cursor-default shadow-inner" 
          : "bg-white shadow-xl shadow-rose-100/40 border border-white hover:border-rose-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-200/60 cursor-pointer"
        }
      `}
    >
      {/* Fondo brilloso animado */}
      {!liked && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:animate-shine pointer-events-none"></div>
      )}

      {/* Contenedor del Corazón con animación */}
      <div className={`relative flex items-center justify-center transition-transform duration-300 ${animating ? "scale-125" : "scale-100"}`}>
        {/* Destello detrás del corazón */}
        <div className={`absolute inset-0 bg-rose-400 blur-lg rounded-full opacity-0 transition-opacity duration-300 ${liked ? "opacity-20" : "group-hover:opacity-40"}`}></div>
        
        <Heart 
          size={24} 
          strokeWidth={2.5}
          className={`relative z-10 transition-all duration-300 
            ${liked 
              ? "fill-rose-500 text-rose-500 drop-shadow-sm" 
              : "text-neutral-300 group-hover:text-rose-400 group-hover:fill-rose-50"
            }`} 
        />
      </div>
      
      {/* Texto y Contador */}
      <div className="flex flex-col items-start leading-none pl-1">
        <span className={`text-lg font-black font-sans tabular-nums transition-colors duration-300 ${liked ? "text-rose-600" : "text-neutral-700 group-hover:text-rose-500"}`}>
            {count.toLocaleString()}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-rose-300 transition-colors">
            Likes
        </span>
      </div>

      {/* Icono extra de "Sparkle" si ya diste like */}
      {liked && (
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-pulse">
              <Sparkles size={12} fill="currentColor" />
          </div>
      )}
    </button>
  );
}