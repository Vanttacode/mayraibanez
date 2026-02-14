import React from "react";

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
    <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-rose-100/50 border border-rose-50">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
          <p className="text-sm text-neutral-500">Fotos, videos y notas cortas.</p>
        </div>
        <a href="/blog" className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest">
          Ver todo →
        </a>
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-4 text-sm text-neutral-600">
          Todavía no hay publicaciones. Cuando Mayra publique, van a aparecer acá 😉
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
          {list.map((p) => (
            <a
              key={p.id}
              href={`/blog/${p.slug}`}
              className="min-w-[260px] max-w-[260px] snap-start rounded-3xl border border-neutral-100 bg-neutral-50 hover:bg-white transition overflow-hidden shadow-sm"
            >
              {p.cover_url ? (
                <img
                  src={p.cover_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div className="h-32 w-full bg-gradient-to-br from-rose-100 to-pink-50" />
              )}

              <div className="p-4">
                <div className="font-semibold text-neutral-800 line-clamp-2">{p.title}</div>
                {p.excerpt ? <div className="text-sm text-neutral-500 mt-1 line-clamp-2">{p.excerpt}</div> : null}
                <div className="text-xs text-neutral-400 mt-2">
                  {new Date(p.published_at ?? p.created_at ?? Date.now()).toLocaleDateString("es-CL")}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
