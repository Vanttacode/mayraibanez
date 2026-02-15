import React from "react";
import { ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";

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
  title = "Últimas publicaciones",
}: {
  posts: PostCard[];
  title?: string;
}) {
  const list = posts ?? [];

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 md:p-8 shadow-xl shadow-rose-100/40 border border-rose-50">
      
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-transparent opacity-50 rounded-bl-[4rem] pointer-events-none"></div>

      {/* HEADER */}
      <div className="relative z-10 flex items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="h-1 w-1 rounded-full bg-rose-500"></div>
             <h3 className="text-xl md:text-2xl font-bold text-neutral-800 tracking-tight">
               {title}
             </h3>
          </div>
          <p className="text-sm text-neutral-500 font-medium pl-3 border-l-2 border-rose-200">
            Fotos, videos y notas cortas.
          </p>
        </div>
        
        <a 
          href="/blog" 
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-300"
        >
          <span>Ver todo</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* LISTA */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 rounded-3xl border border-dashed border-rose-200 bg-rose-50/30">
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-rose-300">
            <Sparkles size={24} />
          </div>
          <p className="text-sm font-semibold text-neutral-600">
            Todavía no hay publicaciones.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Cuando Mayra publique, aparecerán aquí. ✨
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-2 px-2 scrollbar-hide">
          {list.map((p) => (
            <a
              key={p.id}
              href={`/blog/${p.slug}`}
              className="
                group relative min-w-[280px] max-w-[280px] snap-start 
                rounded-[2rem] bg-white p-3 
                border border-rose-100 shadow-lg shadow-rose-50 
                hover:shadow-xl hover:shadow-rose-100/60 hover:-translate-y-1.5 hover:border-rose-200
                transition-all duration-300 flex flex-col
              "
            >
              {/* IMAGEN */}
              <div className="relative h-44 w-full overflow-hidden rounded-[1.5rem] mb-4 bg-neutral-100">
                {p.cover_url ? (
                  <>
                    <img
                      src={p.cover_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay sutil al hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 text-rose-200">
                    <ImageIcon size={32} />
                  </div>
                )}
                
                {/* FECHA (Badge flotante) */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm text-[9px] font-bold text-neutral-600 uppercase tracking-wide">
                  {new Date(p.published_at ?? p.created_at ?? Date.now()).toLocaleDateString("es-CL", { day: 'numeric', month: 'short' })}
                </div>
              </div>

              {/* CONTENIDO */}
              <div className="px-2 pb-2 flex-1 flex flex-col">
                <h4 className="font-bold text-neutral-800 text-lg leading-tight mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                  {p.title}
                </h4>
                
                {p.excerpt ? (
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-3">
                    {p.excerpt}
                  </p>
                ) : null}

                {/* Link simulado "Leer más" */}
                <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider group-hover:text-rose-600 transition-colors">
                  Leer nota <ArrowRight size={10} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}