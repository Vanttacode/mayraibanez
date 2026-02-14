import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminLogin() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const hint = useMemo(() => {
    if (checking) return "Chequeando sesión…";
    return "Si ya tenés sesión activa, te redirige al panel automáticamente.";
  }, [checking]);

  useEffect(() => {
    // Prefill opcional por querystring (solo para tu demo local)
    const sp = new URLSearchParams(window.location.search);
    const qEmail = sp.get("email");
    const qPass = sp.get("password");
    if (qEmail) setEmail(qEmail);
    if (qPass) setPassword(qPass);

    const run = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (data.session) window.location.href = "/admin";
      setChecking(false);
    };
    run();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErr(error.message);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <section className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl border border-rose-100">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-neutral-800">Ingreso Admin</h1>
        <a href="/" className="text-xs text-neutral-500 hover:text-neutral-700 underline">
          Volver
        </a>
      </div>

      <p className="text-sm text-neutral-500 mt-1">Accedé con tu usuario de Supabase Auth.</p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <div>
          <label className="text-xs font-semibold text-neutral-600">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-600">Contraseña</label>
          <input
            className="mt-1 w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <button
          className="mt-1 w-full rounded-xl bg-neutral-900 text-white py-3 text-sm font-bold hover:bg-rose-500 transition"
          type="submit"
          disabled={checking}
        >
          Entrar
        </button>

        <div className="text-[11px] text-neutral-400">{hint}</div>

        {err ? (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-2">
            {err}
          </div>
        ) : null}
      </form>
    </section>
  );
}
