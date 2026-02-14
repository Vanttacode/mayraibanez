import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { Post, Profile } from "@/lib/types";
import { uploadToMediaBucket } from "@/lib/upload";
import { slugify } from "@/lib/slug";

export default function AdminApp() {
  const [loading, setLoading] = useState(true);

  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);

  const isAuthed = !!sessionUserId;

  useEffect(() => {
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      const email = (data.session?.user as any)?.email ?? null;
      setSessionUserId(uid);
      setSessionEmail(email);
      setLoading(false);
    };
    init();

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, sess) => {
      setSessionUserId(sess?.user?.id ?? null);
      setSessionEmail((sess?.user as any)?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sessionUserId) return;

    const load = async () => {
      setLoading(true);

      const { data: p, error: pErr } = await supabaseBrowser
        .from("profiles")
        .select("*")
        .eq("id", sessionUserId)
        .single();

      if (pErr || !p) {
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!p.is_admin) {
        setProfile(p as any);
        setLoading(false);
        return;
      }

      setProfile(p as any);

      const { data: po } = await supabaseBrowser
        .from("posts")
        .select("*")
        .eq("user_id", p.id)
        .order("created_at", { ascending: false });

      setPosts((po as any) ?? []);
      setLoading(false);
    };

    load();
  }, [sessionUserId]);

  const notAdmin = useMemo(
    () => isAuthed && !loading && !!profile && !profile.is_admin,
    [isAuthed, loading, profile]
  );
  const missingProfile = useMemo(
    () => isAuthed && !loading && !profile,
    [isAuthed, loading, profile]
  );

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    setProfile(null);
    setPosts([]);
    setEditing(null);
    window.location.href = "/ingreso-admin";
  }

  if (loading) return <Card>Loading…</Card>;

  if (!isAuthed) {
    return (
      <Card>
        <h1 className="text-lg font-bold text-neutral-800">Admin</h1>
        <p className="text-sm text-neutral-500 mt-1">No hay sesión activa.</p>
        <a
          href="/ingreso-admin"
          className="mt-3 inline-flex justify-center w-full rounded-xl bg-neutral-900 text-white py-3 text-sm font-bold hover:bg-rose-500 transition"
        >
          Ir a ingreso
        </a>
      </Card>
    );
  }

  if (missingProfile) {
    return (
      <Card>
        <h1 className="text-lg font-bold text-neutral-800">Perfil no encontrado</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Estás logueado como <b>{sessionEmail ?? "usuario"}</b> pero falta la fila en{" "}
          <code>public.profiles</code> o RLS no deja leer.
        </p>

        <button
          className="mt-3 w-full rounded-xl border border-rose-200 bg-white py-3 text-sm font-bold text-neutral-800 hover:bg-rose-50 transition"
          onClick={signOut}
        >
          Salir
        </button>
      </Card>
    );
  }

  if (notAdmin) {
    return (
      <Card>
        <h1 className="text-lg font-bold text-neutral-800">Sin permisos</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Estás logueado como <b>{sessionEmail ?? "usuario"}</b> pero{" "}
          <code>profiles.is_admin</code> está en <b>false</b>.
        </p>

        <button
          className="mt-3 w-full rounded-xl border border-rose-200 bg-white py-3 text-sm font-bold text-neutral-800 hover:bg-rose-50 transition"
          onClick={signOut}
        >
          Salir
        </button>
      </Card>
    );
  }

  // ✅ Admin OK: SOLO BLOG
  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-neutral-500">Admin · Blog</div>
            <div className="font-semibold truncate text-neutral-800">{profile!.display_name}</div>
            <div className="text-xs text-neutral-500 truncate">@{profile!.handle}</div>
          </div>
          <button className="btnGhost" onClick={signOut}>
            Salir
          </button>
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          <button className="btnPrimary" onClick={() => createPost(profile!.id)}>
            + Nuevo post
          </button>
          <a className="btnGhost text-center" href="/blog" target="_blank" rel="noreferrer">
            Ver Blog
          </a>
        </div>
      </Card>

      {editing ? (
        <PostEditor
          post={editing}
          userId={profile!.id}
          onClose={() => setEditing(null)}
          onPost={(p) => {
            setEditing(p);
            setPosts(posts.map((x) => (x.id === p.id ? p : x)));
          }}
          onDelete={async () => {
            await delPost(editing.id);
            setPosts(posts.filter((p) => p.id !== editing.id));
            setEditing(null);
          }}
        />
      ) : (
        <Card>
          <h2 className="text-sm font-bold text-neutral-800">Posts</h2>
          <p className="text-xs text-neutral-500 mt-1">Borradores y publicados.</p>

          <div className="mt-3 grid gap-2">
            {posts.map((p) => (
              <button
                key={p.id}
                onClick={() => setEditing(p)}
                className="text-left rounded-2xl border border-rose-100 bg-white p-3 hover:bg-rose-50 transition"
              >
                <div className="font-semibold truncate text-neutral-800">{p.title}</div>
                <div className="text-xs text-neutral-500 truncate">/blog/{p.slug}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {p.published_at
                    ? `Publicado: ${new Date(p.published_at).toLocaleDateString("es-CL")}`
                    : "Borrador"}
                </div>
              </button>
            ))}
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3 text-sm text-neutral-600">
                No hay posts todavía.
              </div>
            ) : null}
          </div>
        </Card>
      )}

      <a href="/" className="block text-xs text-neutral-500 underline text-center">
        Volver al perfil
      </a>

      <style>{baseInputsCss}</style>
    </div>
  );

  async function createPost(userId: string) {
    const baseTitle = "Nueva entrada";
    const slug = slugify(`${baseTitle}-${Date.now()}`);
    const { data, error } = await supabaseBrowser
      .from("posts")
      .insert({
        user_id: userId,
        title: baseTitle,
        slug,
        excerpt: "",
        content_md: "",
        cover_url: null,
        published_at: null,
      })
      .select("*")
      .single();

    if (error) return alert(error.message);
    setPosts([data as any, ...posts]);
    setEditing(data as any);
  }

  async function delPost(id: string) {
    if (!confirm("Eliminar post?")) return;
    const { error } = await supabaseBrowser.from("posts").delete().eq("id", id);
    if (error) alert(error.message);
  }
}

function PostEditor({
  post,
  userId,
  onPost,
  onClose,
  onDelete,
}: {
  post: Post;
  userId: string;
  onPost: (p: Post) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Post>(post);

  async function save(patch?: Partial<Post>) {
    const next = { ...draft, ...(patch ?? {}) };
    setDraft(next);
    setSaving(true);

    const { data, error } = await supabaseBrowser
      .from("posts")
      .update({
        title: next.title,
        slug: next.slug,
        excerpt: next.excerpt,
        content_md: next.content_md,
        cover_url: next.cover_url,
        published_at: next.published_at,
      })
      .eq("id", next.id)
      .select("*")
      .single();

    if (error) alert(error.message);
    if (data) onPost(data as any);
    setSaving(false);
  }

  async function uploadCover(file: File) {
    try {
      setSaving(true);
      const url = await uploadToMediaBucket({ userId, folder: "posts", file });
      await save({ cover_url: url });
    } catch (e: any) {
      alert(e.message ?? "Upload falló");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-neutral-500">Editor</div>
          <div className="font-bold text-neutral-800">Post</div>
        </div>
        <button className="btnGhost" onClick={onClose}>
          Cerrar
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <input
          className="input"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Título"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
            placeholder="slug"
          />
          <button className="btnGhost" onClick={() => setDraft({ ...draft, slug: slugify(draft.title) })}>
            Slug desde título
          </button>
        </div>

        <textarea
          className="input min-h-[70px]"
          value={draft.excerpt}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          placeholder="Extracto"
        />

        <textarea
          className="input min-h-[220px]"
          value={draft.content_md}
          onChange={(e) => setDraft({ ...draft, content_md: e.target.value })}
          placeholder="Contenido (Markdown). Para imágenes/Video pegá el link o usá portada."
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="btnGhost cursor-pointer text-center">
          Subir portada
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
          />
        </label>

        <button
          className="btnPrimary"
          onClick={() => save({ published_at: draft.published_at ? null : new Date().toISOString() })}
          disabled={saving}
        >
          {draft.published_at ? "Despublicar" : "Publicar"}
        </button>
      </div>

      <button className="btnPrimary mt-2" onClick={() => save()} disabled={saving}>
        {saving ? "Guardando…" : "Guardar"}
      </button>

      <button className="btnDanger mt-2" onClick={onDelete}>
        Eliminar post
      </button>

      {draft.cover_url ? (
        <img src={draft.cover_url} className="mt-3 h-40 w-full object-cover rounded-2xl border border-rose-100" alt="" />
      ) : null}
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl border border-rose-100">{children}</section>;
}

const baseInputsCss = `
  .input{ width:100%; background:#fff; border:1px solid rgba(244,63,94,.18); border-radius: 14px; padding: 10px 12px; color:#111827; outline:none; font-size:14px; }
  .input:focus{ border-color: rgba(244,63,94,.35); box-shadow: 0 0 0 3px rgba(244,63,94,.12); }
  .btnPrimary{ width:100%; border-radius: 14px; background:#111827; color:white; font-weight:900; padding:10px 12px; }
  .btnPrimary:hover{ background: rgb(244 63 94); }
  .btnGhost{ width:100%; border-radius: 14px; background: white; border:1px solid rgba(244,63,94,.18); color:#111827; font-weight:900; padding:10px 12px; }
  .btnGhost:hover{ background: rgba(244,63,94,.06); }
  .btnDanger{ width:100%; border-radius: 14px; background: rgba(244,63,94,.10); border:1px solid rgba(244,63,94,.25); color:#111827; font-weight:900; padding:10px 12px; }
`;
