import React from "react";
import { ArrowRight, Sparkles, Image as ImageIcon, Crown } from "lucide-react";

type PostCard = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_url?: string | null;
  published_at?: string | null;
  created_at?: string | null;
};

export default function BlogCarousel({
  posts,
  title = "mi blog", // Título por defecto estilo Barbie
}: {
  posts: PostCard[];
  title?: string;
}) {
  // Duplicamos la lista para lograr el efecto "Infinito" sin cortes
  const list = posts.length > 0 ? [...posts, ...posts, ...posts, ...posts] : [];

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 md:p-8 shadow-xl shadow-pink-200/50 border-2 border-pink-100">
      
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-transparent opacity-40 rounded-bl-[4rem] pointer-events-none"></div>

      {/* HEADER BARBIE */}
      <div className="relative z-10 flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             {/* Icono Corona */}
             <div className="text-pink-400 rotate-[-10deg]">
                <Crown size={24} fill="currentColor" className="opacity-80" />
             </div>
             
             {/* TÍTULO ROSA Y "STICKER" */}
             <h3 className="text-3xl md:text-4xl font-extrabold text-pink-500 tracking-tight font-script lowercase" 
                 style={{ textShadow: "2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff" }}>
               {title}
             </h3>
          </div>
          <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest pl-2 border-l-2 border-pink-300">
            By Mayra ✨
          </p>
        </div>
        
        <a 
          href="/blog" 
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-50 text-pink-500 border border-pink-200 text-[10px] font-extrabold uppercase tracking-widest hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 shadow-sm"
        >
          <span>Ver todo</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* LISTA "MÓVIL" (AUTO-SCROLL) */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 rounded-[2rem] border-2 border-dashed border-pink-200 bg-pink-50/40">
          <div className="bg-white p-4 rounded-full shadow-md mb-3 text-pink-300 border-2 border-pink-100">
            <Sparkles size={28} />
          </div>
          <p className="text-sm font-bold text-pink-500">
            Todavía no hay publicaciones.
          </p>
          <p className="text-xs text-pink-400 mt-1 font-medium">
            ¡Pronto subiré novedades! 💕
          </p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden mask-fade-sides">
          {/* Contenedor Animado */}
          <div className="flex gap-4 animate-scroll hover:pause py-2 pl-2">
            {list.map((p, index) => (
              <a
                key={`${p.id}-${index}`}
                href={`/blog/${p.slug}`}
                className="
                  group relative min-w-[260px] max-w-[260px] 
                  rounded-[2.5rem] bg-white p-3 
                  border-2 border-pink-100 shadow-lg shadow-pink-100 
                  hover:shadow-2xl hover:shadow-pink-200/60 hover:-translate-y-1.5 hover:border-pink-300
                  transition-all duration-300 flex flex-col
                  transform-gpu
                "
              >
                {/* IMAGEN */}
                <div className="relative h-40 w-full overflow-hidden rounded-[2rem] mb-3 bg-pink-50 border border-pink-100">
                  {p.cover_url ? (
                    <>
                      <img
                        src={p.cover_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-white text-pink-200">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  
                  {/* FECHA */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-sm text-[8px] font-extrabold text-pink-500 uppercase tracking-wide border border-pink-100">
                    {new Date(p.published_at ?? p.created_at ?? Date.now()).toLocaleDateString("es-CL", { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                {/* CONTENIDO */}
                <div className="px-2 pb-1 flex-1 flex flex-col">
                  <h4 className="font-bold text-neutral-800 text-base leading-tight mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                    {p.title}
                  </h4>
                  
                  {/* Link simulado */}
                  <div className="mt-auto pt-2 flex items-center gap-1 text-[9px] font-extrabold text-pink-300 uppercase tracking-wider group-hover:text-pink-500 transition-colors">
                    Leer <ArrowRight size={10} strokeWidth={3} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Estilos para la animación (Inline para asegurar que funcione en React sin configurar global css) */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite; /* Velocidad suave */
          width: max-content;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
        /* Máscara para suavizar los bordes */
        .mask-fade-sides {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </section>
  );
}