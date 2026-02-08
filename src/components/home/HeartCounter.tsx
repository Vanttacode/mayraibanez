import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@supabase/supabase-js";
import { SITE_HANDLE } from "@/lib/site"; // Asegúrate de tener esto o usa el string directo

// Inicializamos cliente CLIENT-SIDE (necesitas tus variables públicas aquí)
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

  // Al cargar, intentamos obtener el número real más reciente
  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("likes")
        .eq("handle", SITE_HANDLE) // O usa el handle que prefieras
        .single();
      
      if (data && !error) {
        setCount(data.likes || 0);
      }
    };
    fetchLikes();
  }, []);

  const triggerConfetti = () => {
    // Explosión de colores estilo "Barbie" (Rosas y Dorados)
    const scalar = 2;
    const pink = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' }); // Triángulos

    confetti({
      particleCount: 20,
      spread: 70,
      origin: { y: 0.7 }, // Sale desde abajo un poco
      colors: ['#ec4899', '#be185d', '#fb7185', '#ffd700'], // Rosas y Dorado
      shapes: ['circle', 'square'], 
      disableForReducedMotion: true
    });
  };

  const handleLike = async () => {
    if (liked) return; // Evita spam masivo del mismo usuario en la misma sesión

    // 1. UI Optimista (Actualiza visualmente YA)
    setCount((prev) => prev + 1);
    setLiked(true);
    setAnimating(true);
    
    // 2. BOOM! Confeti
    triggerConfetti();

    // 3. Guardar en Base de Datos (en segundo plano)
    try {
        await supabase.rpc("increment_likes", { p_handle: SITE_HANDLE });
    } catch (error) {
        console.error("Error guardando like:", error);
        // Si falla, podrías restar el like, pero es mejor no interrumpir la experiencia
    }

    setTimeout(() => setAnimating(false), 800);
  };

  return (
    <button
      onClick={handleLike}
      className={`
        relative group flex items-center gap-2 px-5 py-2.5 rounded-full 
        transition-all duration-300 transform active:scale-95 shadow-sm
        ${liked 
          ? "bg-rose-50 text-rose-600 border border-rose-200 cursor-default" 
          : "bg-white text-neutral-500 border border-neutral-200 hover:border-rose-300 hover:text-rose-500 hover:shadow-md cursor-pointer"
        }
      `}
    >
      <div className={`relative ${animating ? "animate-heart-click" : ""}`}>
        <Heart 
          size={22} 
          className={`transition-colors duration-300 ${liked ? "fill-rose-500 text-rose-500" : "fill-transparent"}`} 
        />
      </div>
      
      <div className="flex flex-col items-start leading-none">
        <span className="text-base font-bold font-sans tabular-nums">
            {count.toLocaleString()}
        </span>
        <span className="text-[9px] uppercase tracking-wider opacity-70 font-bold">
            Likes
        </span>
      </div>
    </button>
  );
}