import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { Post, Profile } from "@/lib/types";
import { uploadToMediaBucket } from "@/lib/upload";
import { slugify } from "@/lib/slug";
import { Image as ImageIcon, Video, X, ArrowLeft, Loader2, Save, Trash2, Globe, Plus, Upload } from "lucide-react";

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

  // --- RENDERS DE ESTADO ---

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-rose-500" size={32} />
    </div>
  );

  if (!isAuthed) {
    return (
      <Card>
        <div className="text-center py-6">
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Acceso Administrador</h1>
            <p className="text-sm text-neutral-500 mb-6">Debes iniciar sesión para continuar.</p>
            <a
            href="/ingreso-admin"
            className="inline-flex items-center justify-center w-full rounded-xl bg-neutral-900 text-white py-3 text-sm font-bold hover:bg-rose-500 transition-colors"
            >
            Ir a Login
            </a>
        </div>
      </Card>
    );
  }

  if (missingProfile || notAdmin) {
    return (
      <Card>
        <div className="text-center py-6">
            <div className="bg-rose-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <X size={24} />
            </div>
            <h1 className="text-lg font-bold text-neutral-800">Acceso Denegado</h1>
            <p className="text-sm text-neutral-500 mt-2 mb-6 px-4">
            La cuenta <b>{sessionEmail}</b> no tiene permisos de administrador.
            </p>
            <button
            className="w-full rounded-xl border border-rose-200 bg-white py-3 text-sm font-bold text-neutral-800 hover:bg-rose-50 transition"
            onClick={signOut}
            >
            Cerrar Sesión
            </button>
        </div>
      </Card>
    );
  }

  // --- RENDER PRINCIPAL (ADMIN) ---

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Header Admin */}
      {!editing && (
        <Card>
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {/* Avatar admin */}
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-lg border border-rose-200">
                        {profile!.display_name?.charAt(0) || "A"}
                    </div>
                    <div>
                        <div className="font-bold text-neutral-800 leading-tight">{profile!.display_name}</div>
                        <div className="text-xs text-neutral-400">Panel de Control</div>
                    </div>
                </div>
                <button className="text-xs font-bold text-rose-500 hover:text-rose-700 underline" onClick={signOut}>
                    Salir
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 text-white py-3 text-sm font-bold hover:bg-rose-500 transition-all shadow-lg shadow-neutral-200"
                    onClick={() => createPost(profile!.id)}
                >
                    <Plus size={16} /> Nuevo Post
                </button>
                <a 
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-rose-500 py-3 text-sm font-bold hover:bg-rose-50 transition-colors"
                    href="/blog" 
                    target="_blank" 
                    rel="noreferrer"
                >
                    <Globe size={16} /> Ver Blog
                </a>
            </div>
        </Card>
      )}

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
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-neutral-800">Entradas Recientes</h2>
             <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">{posts.length}</span>
          </div>

          <div className="space-y-3">
            {posts.map((p) => (
              <button
                key={p.id}
                onClick={() => setEditing(p)}
                className="w-full text-left group relative flex items-center gap-4 rounded-2xl border border-transparent bg-neutral-50 p-3 hover:bg-white hover:border-rose-200 hover:shadow-md transition-all duration-300"
              >
                {/* Miniatura Cover */}
                <div className="h-16 w-16 shrink-0 rounded-xl bg-neutral-200 overflow-hidden border border-neutral-100">
                    {p.cover_url ? (
                        <img src={p.cover_url} className="h-full w-full object-cover" alt="" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-neutral-400">
                            <ImageIcon size={20} />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="font-bold text-neutral-800 truncate group-hover:text-rose-500 transition-colors">
                        {p.title || "Sin título"}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.published_at ? "bg-green-400" : "bg-orange-300"}`}></span>
                        {p.published_at 
                            ? new Date(p.published_at).toLocaleDateString("es-CL", {day: 'numeric', month: 'short'}) 
                            : "Borrador"
                        }
                    </div>
                </div>
                
                <div className="text-neutral-300 group-hover:text-rose-400">
                    <ArrowLeft size={18} className="rotate-180" />
                </div>
              </button>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12 text-neutral-400 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                <p>No hay publicaciones aún.</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Estilos globales para inputs (CSS-in-JS simple) */}
      <style>{`
        .input-base {
            width: 100%;
            background: #f9fafb; /* neutral-50 */
            border: 1px solid #e5e7eb; /* neutral-200 */
            border-radius: 12px;
            padding: 12px 16px;
            color: #1f2937; /* neutral-800 */
            outline: none;
            font-size: 14px;
            transition: all 0.2s;
        }
        .input-base:focus {
            background: #fff;
            border-color: #fbcfe8; /* rose-200 */
            box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1);
        }
      `}</style>
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
    if (!confirm("¿Seguro que quieres eliminar este post? Esta acción no se puede deshacer.")) return;
    const { error } = await supabaseBrowser.from("posts").delete().eq("id", id);
    if (error) alert(error.message);
  }
}

// --- EDITOR DE POSTS ---

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-guardado local para feedback visual
  const updateDraft = (patch: Partial<Post>) => {
      setDraft(prev => ({ ...prev, ...patch }));
  };

  async function save(patch?: Partial<Post>) {
    setSaving(true);
    const next = { ...draft, ...(patch ?? {}) };
    updateDraft(patch || {});

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

    setSaving(false);
    if (error) {
        alert("Error al guardar: " + error.message);
    } else if (data) {
        onPost(data as any);
    }
  }

  // Subir portada principal
  async function uploadCover(file: File) {
    try {
      setSaving(true);
      const url = await uploadToMediaBucket({ userId, folder: "cover", file });
      await save({ cover_url: url });
    } catch (e: any) {
      alert(e.message ?? "Error subiendo portada");
      setSaving(false);
    }
  }

  // Subir imagen al cuerpo del post (Markdown)
  async function uploadContentImage(file: File) {
    try {
        setSaving(true);
        const url = await uploadToMediaBucket({ userId, folder: "posts", file });
        
        // Insertar markdown en el cursor o al final
        const markdownImage = `\n![Imagen](${url})\n`;
        const newContent = (draft.content_md || "") + markdownImage;
        
        await save({ content_md: newContent });
    } catch (e: any) {
        alert(e.message ?? "Error subiendo imagen al contenido");
        setSaving(false);
    }
  }

  return (
    <Card>
      {/* Header Editor */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
        <button 
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors text-sm font-bold"
            onClick={onClose}
        >
            <ArrowLeft size={18} /> Volver
        </button>
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-rose-400 uppercase tracking-widest">
                {saving ? "Guardando..." : "Editor"}
            </span>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Título */}
        <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1 ml-1">Título</label>
            <input
            className="input-base text-lg font-bold"
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
            placeholder="Escribe un título..."
            />
        </div>

        {/* Slug + Botón generar */}
        <div className="grid grid-cols-[1fr_auto] gap-2">
            <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1 ml-1">Slug (URL)</label>
                <input
                    className="input-base font-mono text-xs text-rose-500"
                    value={draft.slug}
                    onChange={(e) => updateDraft({ slug: slugify(e.target.value) })}
                    placeholder="url-amigable"
                />
            </div>
            <div className="flex items-end">
                <button 
                    className="px-3 py-3 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 font-bold text-xs"
                    onClick={() => updateDraft({ slug: slugify(draft.title) })}
                    title="Generar slug desde título"
                >
                    Auto
                </button>
            </div>
        </div>

        {/* Portada */}
        <div>
             <label className="block text-xs font-bold text-neutral-400 uppercase mb-1 ml-1">Foto de Portada</label>
             <div className="relative group rounded-2xl overflow-hidden bg-neutral-100 border-2 border-dashed border-neutral-200 hover:border-rose-300 transition-colors min-h-[160px] flex items-center justify-center">
                {draft.cover_url ? (
                    <>
                        <img src={draft.cover_url} className="w-full h-48 object-cover" alt="Cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Cambiar Imagen</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6">
                        <ImageIcon className="mx-auto text-neutral-300 mb-2" size={32} />
                        <span className="text-xs font-bold text-neutral-400">Click para subir portada</span>
                    </div>
                )}
                
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                />
             </div>
        </div>

        {/* Extracto */}
        <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1 ml-1">Extracto (Resumen)</label>
            <textarea
            className="input-base min-h-[80px] resize-none"
            value={draft.excerpt}
            onChange={(e) => updateDraft({ excerpt: e.target.value })}
            placeholder="Breve descripción que se verá en la lista..."
            />
        </div>

        {/* Contenido Markdown */}
        <div>
            <div className="flex items-center justify-between mb-1 ml-1">
                <label className="block text-xs font-bold text-neutral-400 uppercase">Contenido</label>
                {/* Botón Mágico: Subir foto al contenido */}
                <label className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-lg">
                    <Upload size={12} /> Insertar Foto
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && uploadContentImage(e.target.files[0])}
                    />
                </label>
            </div>
            <textarea
            className="input-base min-h-[300px] font-mono text-sm leading-relaxed"
            value={draft.content_md}
            onChange={(e) => updateDraft({ content_md: e.target.value })}
            placeholder="# Escribe tu historia aquí..."
            />
            <p className="text-[10px] text-neutral-400 mt-1 pl-1">
                Soporta Markdown. Usa el botón de arriba para insertar imágenes.
            </p>
        </div>
      </div>

      {/* Footer Acciones */}
      <div className="border-t border-rose-100 mt-6 pt-6 flex flex-col gap-3">
        
        <div className="grid grid-cols-2 gap-3">
            <button
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    draft.published_at 
                    ? "bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
                onClick={() => save({ published_at: draft.published_at ? null : new Date().toISOString() })}
                disabled={saving}
            >
                {draft.published_at ? "Ocultar (Borrador)" : "Publicar Ahora"}
            </button>

            <button
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-rose-500 transition-all shadow-md"
                onClick={() => save()}
                disabled={saving}
            >
                {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                Guardar Cambios
            </button>
        </div>

        <button 
            className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" 
            onClick={onDelete}
        >
            <Trash2 size={14} /> Eliminar Entrada
        </button>

      </div>
    </Card>
  );
}

// --- UI CARD GENÉRICA ---
function Card({ children }: { children: React.ReactNode }) {
  return <section className="w-full rounded-[2rem] bg-white p-6 md:p-8 shadow-xl shadow-rose-100/40 border border-rose-50 animate-fade-in">{children}</section>;
}