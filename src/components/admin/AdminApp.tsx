import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { Brand, Post, Profile, SocialLink } from "@/lib/types";
import { uploadToMediaBucket } from "@/lib/upload";
import { slugify } from "@/lib/slug";

type Tab = "profile" | "socials" | "brands" | "posts";

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Auth form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Data
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const isAuthed = !!sessionUserId;

  useEffect(() => {
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      setSessionUserId(uid);
      setLoading(false);
    };
    init();

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, sess) => {
      setSessionUserId(sess?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sessionUserId) return;

    const load = async () => {
      setLoading(true);

      const { data: p } = await supabaseBrowser
        .from("profiles")
        .select("*")
        .eq("id", sessionUserId)
        .single();

      if (!p || !p.is_admin) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(p);

      const [{ data: s }, { data: b }, { data: po }] = await Promise.all([
        supabaseBrowser.from("social_links").select("*").eq("user_id", p.id).order("sort", { ascending: true }),
        supabaseBrowser.from("brands").select("*").eq("user_id", p.id).order("sort", { ascending: true }),
        supabaseBrowser.from("posts").select("*").eq("user_id", p.id).order("created_at", { ascending: false }),
      ]);

      setSocials((s as any) ?? []);
      setBrands((b as any) ?? []);
      setPosts((po as any) ?? []);

      setLoading(false);
    };

    load();
  }, [sessionUserId]);

  const notAdmin = useMemo(() => isAuthed && !loading && !profile, [isAuthed, loading, profile]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    setProfile(null);
    setSocials([]);
    setBrands([]);
    setPosts([]);
  }

  if (loading) {
    return <Card>Loading…</Card>;
  }

  if (!isAuthed) {
    return (
      <Card>
        <h1 className="text-lg font-bold">Admin</h1>
        <p className="text-sm text-white/60 mt-1">Ingresá con email y contraseña (Supabase Auth).</p>

        <form onSubmit={signIn} className="mt-4 grid gap-2">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <button className="btnPrimary" type="submit">Entrar</button>
        </form>

        <a href="/" className="mt-3 inline-block text-xs text-white/50 underline">Volver al perfil</a>
      </Card>
    );
  }

  if (notAdmin) {
    return (
      <Card>
        <h1 className="text-lg font-bold">Sin permisos</h1>
        <p className="text-sm text-white/60 mt-1">
          Este usuario no tiene <span className="text-white">is_admin</span> habilitado en la tabla profiles.
        </p>
        <button className="btnGhost mt-3" onClick={signOut}>Salir</button>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-white/60">Admin</div>
            <div className="font-semibold truncate">{profile.display_name}</div>
            <div className="text-xs text-white/50 truncate">@{profile.handle}</div>
          </div>
          <button className="btnGhost" onClick={signOut}>Salir</button>
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>Perfil</TabBtn>
          <TabBtn active={tab === "socials"} onClick={() => setTab("socials")}>Redes</TabBtn>
          <TabBtn active={tab === "brands"} onClick={() => setTab("brands")}>Marcas</TabBtn>
          <TabBtn active={tab === "posts"} onClick={() => setTab("posts")}>Blog</TabBtn>
        </div>
      </Card>

      {tab === "profile" && (
        <ProfileEditor profile={profile} onProfile={setProfile} />
      )}

      {tab === "socials" && (
        <SocialEditor userId={profile.id} socials={socials} setSocials={setSocials} />
      )}

      {tab === "brands" && (
        <BrandsEditor userId={profile.id} brands={brands} setBrands={setBrands} />
      )}

      {tab === "posts" && (
        <PostsEditor userId={profile.id} posts={posts} setPosts={setPosts} />
      )}

      <a href="/" className="block text-xs text-white/50 underline text-center">Ver sitio</a>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-3xl border border-white/10 bg-white/5 p-4">{children}</section>;
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-2xl px-3 py-2 text-sm font-semibold transition border",
        active ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ProfileEditor({ profile, onProfile }: { profile: Profile; onProfile: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: profile.display_name,
    bio: profile.bio,
    community_label: profile.community_label,
    community_href: profile.community_href,
  });

  async function save() {
    setSaving(true);
    const { data, error } = await supabaseBrowser
      .from("profiles")
      .update(form)
      .eq("id", profile.id)
      .select("*")
      .single();
    if (error) alert(error.message);
    if (data) onProfile(data as any);
    setSaving(false);
  }

  async function onUpload(kind: "avatar" | "cover", file: File) {
    try {
      setSaving(true);
      const url = await uploadToMediaBucket({ userId: profile.id, folder: kind, file });
      const patch = kind === "avatar" ? { avatar_url: url } : { cover_url: url };
      const { data, error } = await supabaseBrowser
        .from("profiles")
        .update(patch)
        .eq("id", profile.id)
        .select("*")
        .single();
      if (error) throw error;
      onProfile(data as any);
    } catch (e: any) {
      alert(e.message ?? "Upload falló");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-white/80">Perfil</h2>

      <div className="mt-3 grid gap-2">
        <input className="input" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="Nombre" />
        <textarea className="input min-h-[90px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Descripción/Bio" />
        <input className="input" value={form.community_label} onChange={(e) => setForm({ ...form, community_label: e.target.value })} placeholder="Texto del botón comunidad" />
        <input className="input" value={form.community_href} onChange={(e) => setForm({ ...form, community_href: e.target.value })} placeholder="Link de comunidad (Instagram / grupo)" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="btnGhost cursor-pointer text-center">
          Subir avatar
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload("avatar", f);
          }} />
        </label>

        <label className="btnGhost cursor-pointer text-center">
          Subir portada
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload("cover", f);
          }} />
        </label>
      </div>

      <button className="btnPrimary mt-3" onClick={save} disabled={saving}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>

      <style>{baseInputsCss}</style>
    </Card>
  );
}

function SocialEditor({
  userId,
  socials,
  setSocials,
}: {
  userId: string;
  socials: SocialLink[];
  setSocials: (x: SocialLink[]) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function add() {
    const sort = (socials.at(-1)?.sort ?? 0) + 10;
    const { data, error } = await supabaseBrowser
      .from("social_links")
      .insert({ user_id: userId, platform: "instagram", label: "Instagram", href: "https://instagram.com/", sort, enabled: true })
      .select("*")
      .single();
    if (error) return alert(error.message);
    setSocials([...socials, data as any]);
  }

  async function updateRow(id: string, patch: Partial<SocialLink>) {
    setSaving(true);
    const { data, error } = await supabaseBrowser.from("social_links").update(patch).eq("id", id).select("*").single();
    if (error) alert(error.message);
    if (data) setSocials(socials.map((s) => (s.id === id ? (data as any) : s)));
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("Eliminar link?")) return;
    const { error } = await supabaseBrowser.from("social_links").delete().eq("id", id);
    if (error) return alert(error.message);
    setSocials(socials.filter((s) => s.id !== id));
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/80">Redes</h2>
        <button className="btnGhost" onClick={add}>+ Agregar</button>
      </div>

      <div className="mt-3 grid gap-2">
        {socials.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <input className="input" value={s.label} onChange={(e) => updateRow(s.id, { label: e.target.value })} />
              <input className="input" value={s.platform} onChange={(e) => updateRow(s.id, { platform: e.target.value })} />
            </div>
            <input className="input" value={s.href} onChange={(e) => updateRow(s.id, { href: e.target.value })} />

            <div className="flex items-center justify-between">
              <label className="text-xs text-white/60 flex items-center gap-2">
                <input type="checkbox" checked={s.enabled} onChange={(e) => updateRow(s.id, { enabled: e.target.checked })} />
                Visible
              </label>
              <button className="btnDanger" onClick={() => del(s.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {saving ? <div className="text-xs text-white/40 mt-2">Guardando…</div> : null}
      <style>{baseInputsCss}</style>
    </Card>
  );
}

function BrandsEditor({
  userId,
  brands,
  setBrands,
}: {
  userId: string;
  brands: Brand[];
  setBrands: (x: Brand[]) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function add() {
    const sort = (brands.at(-1)?.sort ?? 0) + 10;
    const { data, error } = await supabaseBrowser
      .from("brands")
      .insert({ user_id: userId, name: "Marca", logo_url: null, sort, enabled: true })
      .select("*")
      .single();
    if (error) return alert(error.message);
    setBrands([...brands, data as any]);
  }

  async function updateRow(id: string, patch: Partial<Brand>) {
    setSaving(true);
    const { data, error } = await supabaseBrowser.from("brands").update(patch).eq("id", id).select("*").single();
    if (error) alert(error.message);
    if (data) setBrands(brands.map((b) => (b.id === id ? (data as any) : b)));
    setSaving(false);
  }

  async function uploadLogo(brandId: string, file: File) {
    try {
      setSaving(true);
      const url = await uploadToMediaBucket({ userId, folder: "brands", file });
      await updateRow(brandId, { logo_url: url });
    } catch (e: any) {
      alert(e.message ?? "Upload falló");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Eliminar marca?")) return;
    const { error } = await supabaseBrowser.from("brands").delete().eq("id", id);
    if (error) return alert(error.message);
    setBrands(brands.filter((b) => b.id !== id));
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/80">Marcas (carrusel)</h2>
        <button className="btnGhost" onClick={add}>+ Agregar</button>
      </div>

      <div className="mt-3 grid gap-2">
        {brands.map((b) => (
          <div key={b.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 grid gap-2">
            <div className="flex items-center gap-2">
              <input className="input flex-1" value={b.name} onChange={(e) => updateRow(b.id, { name: e.target.value })} />
              <label className="btnGhost cursor-pointer">
                Logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadLogo(b.id, f);
                }} />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs text-white/60 flex items-center gap-2">
                <input type="checkbox" checked={b.enabled} onChange={(e) => updateRow(b.id, { enabled: e.target.checked })} />
                Visible
              </label>
              <button className="btnDanger" onClick={() => del(b.id)}>Eliminar</button>
            </div>

            {b.logo_url ? (
              <img src={b.logo_url} className="h-10 w-auto opacity-80 grayscale" alt="" />
            ) : (
              <div className="text-xs text-white/40">Sin logo aún</div>
            )}
          </div>
        ))}
      </div>

      {saving ? <div className="text-xs text-white/40 mt-2">Guardando…</div> : null}
      <style>{baseInputsCss}</style>
    </Card>
  );
}

function PostsEditor({
  userId,
  posts,
  setPosts,
}: {
  userId: string;
  posts: Post[];
  setPosts: (x: Post[]) => void;
}) {
  const [editing, setEditing] = useState<Post | null>(null);

  async function create() {
    const baseTitle = "Nueva entrada";
    const slug = slugify(`${baseTitle}-${Date.now()}`);
    const { data, error } = await supabaseBrowser
      .from("posts")
      .insert({ user_id: userId, title: baseTitle, slug, excerpt: "", content_md: "", cover_url: null, published_at: null })
      .select("*")
      .single();
    if (error) return alert(error.message);
    setPosts([data as any, ...posts]);
    setEditing(data as any);
  }

  async function del(id: string) {
    if (!confirm("Eliminar post?")) return;
    const { error } = await supabaseBrowser.from("posts").delete().eq("id", id);
    if (error) return alert(error.message);
    setPosts(posts.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/80">Blog</h2>
        <button className="btnGhost" onClick={create}>+ Nuevo</button>
      </div>

      {editing ? (
        <PostEditor
          post={editing}
          onPost={(p) => {
            setEditing(p);
            setPosts(posts.map((x) => (x.id === p.id ? p : x)));
          }}
          onClose={() => setEditing(null)}
          userId={userId}
          onDelete={() => del(editing.id)}
        />
      ) : (
        <div className="mt-3 grid gap-2">
          {posts.map((p) => (
            <button
              key={p.id}
              onClick={() => setEditing(p)}
              className="text-left rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-white/10 transition"
            >
              <div className="font-semibold truncate">{p.title}</div>
              <div className="text-xs text-white/50 truncate">/{p.slug}</div>
              <div className="text-xs text-white/50 mt-1">
                {p.published_at ? `Publicado: ${new Date(p.published_at).toLocaleDateString("es-CL")}` : "Borrador"}
              </div>
            </button>
          ))}
          {posts.length === 0 ? <div className="text-sm text-white/60">No hay posts aún.</div> : null}
        </div>
      )}

      <style>{baseInputsCss}</style>
    </Card>
  );
}

function PostEditor({
  post,
  onPost,
  onClose,
  userId,
  onDelete,
}: {
  post: Post;
  onPost: (p: Post) => void;
  onClose: () => void;
  userId: string;
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
    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 grid gap-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Editar post</div>
        <button className="btnGhost" onClick={onClose}>Cerrar</button>
      </div>

      <input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Título" />
      <div className="grid grid-cols-2 gap-2">
        <input className="input" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} placeholder="slug" />
        <button className="btnGhost" onClick={() => setDraft({ ...draft, slug: slugify(draft.title) })}>Slug desde título</button>
      </div>
      <textarea className="input min-h-[70px]" value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} placeholder="Extracto" />
      <textarea className="input min-h-[220px]" value={draft.content_md} onChange={(e) => setDraft({ ...draft, content_md: e.target.value })} placeholder="Contenido (Markdown)" />

      <div className="grid grid-cols-2 gap-2">
        <label className="btnGhost cursor-pointer text-center">
          Subir portada
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadCover(f);
          }} />
        </label>

        <button
          className="btnPrimary"
          onClick={() => save({ published_at: draft.published_at ? null : new Date().toISOString() })}
          disabled={saving}
        >
          {draft.published_at ? "Despublicar" : "Publicar"}
        </button>
      </div>

      <button className="btnPrimary" onClick={() => save()} disabled={saving}>
        {saving ? "Guardando…" : "Guardar"}
      </button>

      <button className="btnDanger" onClick={onDelete}>Eliminar post</button>

      {draft.cover_url ? <img src={draft.cover_url} className="h-28 w-full object-cover rounded-xl border border-white/10" alt="" /> : null}
    </div>
  );
}

const baseInputsCss = `
  .input{ background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 10px 12px; color:white; outline:none; }
  .input:focus{ border-color: rgba(255,255,255,.22); }
  .btnPrimary{ width:100%; border-radius: 16px; background:white; color:black; font-weight:700; padding:10px 12px; }
  .btnGhost{ width:100%; border-radius: 16px; background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); color:white; font-weight:700; padding:10px 12px; }
  .btnDanger{ width:100%; border-radius: 16px; background: rgba(255,60,60,.12); border:1px solid rgba(255,60,60,.25); color:white; font-weight:800; padding:10px 12px; }
`;
