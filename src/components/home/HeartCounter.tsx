import { useState, useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@supabase/supabase-js";
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
    const heart = confetti.shapeFromPath({ path: 'M16.7 5.3a5.3 5.3 0 0 0-7.5 0l-.9.9-.8-.9a5.3 5.3 0 0 0-7.5 7.5L8.3 21l8.3-8.3a5.3 5.3 0 0 0 0-7.4z' });

    confetti({
      particleCount: 35,
      spread: 90,
      origin: { y: 0.65 },
      // Paleta Barbie: Fucsia, Rosa Chicle, Rosa Pastel y Oro
      colors: ['#db2777', '#ec4899', '#f9a8d4', '#fbbf24'], 
      shapes: [heart, 'circle'], 
      scalar: 1.3, // Partículas un poco más grandes
      disableForReducedMotion: true,
      ticks: 200 
    });
  };

  const handleLike = async () => {
    if (liked) return; 

    setCount((prev) => prev + 1);
    setLiked(true);
    setAnimating(true);
    triggerConfetti();

    try {
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
        transition-all duration-300 transform
        ${liked 
          ? "bg-gradient-to-r from-pink-100 to-white border-2 border-pink-300 cursor-default shadow-inner" 
          : "bg-white shadow-xl shadow-pink-200/50 border-2 border-pink-100 hover:border-pink-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-300/40 cursor-pointer"
        }
      `}
    >
      {/* Fondo brilloso animado */}
      {!liked && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:animate-shine pointer-events-none"></div>
      )}

      {/* Contenedor del Corazón */}
      <div className={`relative flex items-center justify-center transition-transform duration-300 ${animating ? "scale-125" : "scale-100"}`}>
        {/* Destello detrás */}
        <div className={`absolute inset-0 bg-pink-400 blur-lg rounded-full opacity-0 transition-opacity duration-300 ${liked ? "opacity-30" : "group-hover:opacity-50"}`}></div>
        
        <Heart 
          size={26} 
          strokeWidth={2.5}
          className={`relative z-10 transition-all duration-300 
            ${liked 
              ? "fill-pink-500 text-pink-500 drop-shadow-sm" 
              : "text-pink-200 group-hover:text-pink-500 group-hover:fill-pink-50"
            }`} 
        />
      </div>
      
      {/* Texto y Contador */}
      <div className="flex flex-col items-start leading-none pl-1">
        <span className={`text-xl font-black font-sans tabular-nums transition-colors duration-300 ${liked ? "text-pink-600" : "text-neutral-700 group-hover:text-pink-500"}`}>
            {count.toLocaleString()}
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-pink-300 group-hover:text-pink-400 transition-colors">
            Likes
        </span>
      </div>

      {/* Icono Sparkle (Brillo) */}
      {liked && (
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-pulse">
              <Sparkles size={14} fill="currentColor" />
          </div>
      )}
    </button>
  );
}