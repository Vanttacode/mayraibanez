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
  title = "Últimas Noticias",
}: {
  posts: PostCard[];
  title?: string;
}) {
  // Duplicamos la lista para lograr el efecto "infinito" sin cortes
  const list = posts.length > 0 ? [...posts, ...posts, ...posts, ...posts] : [];

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white py-10 shadow-sm border border-slate-100">
      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-6 md:px-10 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Crown size={28} className="text-pink-400 -rotate-12 shrink-0" strokeWidth={2.5} />
            <h2 className="text-3xl md:text-4xl font-extrabold text-pink-500 tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-sm font-medium text-pink-500 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-pink-300 rounded-full" />
            Por Mayra ✨
          </p>
        </div>

        <a
          href="/blog"
          className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-colors duration-300 shadow-md shrink-0 w-fit"
        >
          <span>Ver todo</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* LISTA "MÓVIL" (AUTO-SCROLL) */}
      {posts.length === 0 ? (
        <div className="mx-6 md:mx-10 flex flex-col items-center justify-center text-center py-16 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 text-pink-400">
            <Sparkles size={32} />
          </div>
          <p className="text-lg font-semibold text-slate-700">Todavía no hay publicaciones.</p>
          <p className="text-sm text-slate-500 mt-1">¡Pronto subiré novedades! 💕</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden mask-fade-sides">
          {/* Contenedor animado */}
          <div className="flex gap-6 animate-scroll hover:pause py-4 pl-6 md:pl-10">
            {list.map((p, index) => (
              <a
                key={`${p.id}-${index}`}
                href={`/blog/${p.slug}`}
                className="
                  group relative w-[280px] shrink-0 flex flex-col
                  bg-white rounded-[1.5rem] border border-slate-100 
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                  hover:shadow-[0_8px_30px_rgb(236,72,153,0.12)] 
                  hover:-translate-y-1 transition-all duration-300 overflow-hidden
                "
              >
                {/* IMAGEN */}
                <div className="relative h-48 w-full bg-slate-50 overflow-hidden">
                  {p.cover_url ? (
                    <>
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={40} />
                    </div>
                  )}

                  {/* FECHA */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-xs font-bold text-pink-500 tracking-wide">
                    {new Date(p.published_at ?? p.created_at ?? Date.now()).toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>

                {/* CONTENIDO */}
                <div className="p-5 flex-1 flex flex-col bg-white">
                  <h4 className="font-bold text-slate-800 text-lg leading-snug mb-3 group-hover:text-pink-500 transition-colors line-clamp-2">
                    {p.title}
                  </h4>

                  <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-pink-500 transition-colors">
                    Leer artículo <ArrowRight size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Estilos inline simplificados (Solo lo esencial para scroll y máscara) */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* -12px para compensar la mitad del gap */
        }

        .animate-scroll {
          animation: scroll 35s linear infinite;
          width: max-content;
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        /* Máscara para suavizar los bordes (Efecto desvanecido a los lados) */
        .mask-fade-sides {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </section>
  );
}