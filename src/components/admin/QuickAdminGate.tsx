import React, { useState } from "react";

export default function QuickAdminGate() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    // ⚠️ DEMO ONLY: credenciales en el cliente (inseguro). Reemplazar por Supabase Auth en prod.
    if (user.trim().toUpperCase() === "MAYRA" && pass === "123") {
      sessionStorage.setItem("quick_admin_ok", String(Date.now()));
      window.location.href = "/admin";
      return;
    }
    setErr("Credenciales inválidas.");
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <h1 className="text-lg font-bold">Ingreso Admin (demo)</h1>
      <p className="text-sm text-white/60 mt-1">
        Esto es un gate temporal. El login real es el de Supabase dentro de /admin.
      </p>

      <form onSubmit={submit} className="mt-4 grid gap-2">
        <input
          className="input"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Contraseña"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        {err ? <div className="text-xs text-red-300">{err}</div> : null}
        <button className="btnPrimary" type="submit">Entrar</button>
      </form>

      <style>{`
        .input{ background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 10px 12px; color:white; outline:none; }
        .input:focus{ border-color: rgba(255,255,255,.22); }
        .btnPrimary{ width:100%; border-radius: 16px; background:white; color:black; font-weight:800; padding:10px 12px; }
      `}</style>
    </section>
  );
}
