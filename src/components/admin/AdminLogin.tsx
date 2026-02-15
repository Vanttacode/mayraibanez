import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Lock, Mail, Key, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false); // Estado para el submit del form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const hint = useMemo(() => {
    if (checking) return "Verificando sesión...";
    return "Ingresa tus credenciales de administrador.";
  }, [checking]);

  useEffect(() => {
    // Prefill opcional
    const sp = new URLSearchParams(window.location.search);
    const qEmail = sp.get("email");
    const qPass = sp.get("password");
    if (qEmail) setEmail(qEmail);
    if (qPass) setPassword(qPass);

    const run = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (data.session) {
          window.location.href = "/admin";
      } else {
          setChecking(false);
      }
    };
    run();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErr(error.message === "Invalid login credentials" ? "Credenciales incorrectas" : error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
        window.location.href = "/admin";
    } else {
        setLoading(false);
    }
  }

  // Estilos de Inputs
  const inputClass = "w-full pl-10 pr-4 py-3 text-sm bg-neutral-50 border border-rose-100 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all placeholder:text-neutral-400 text-neutral-700";

  return (
    <section className="relative w-full max-w-md mx-auto">
        
      {/* Decoración de fondo (Glow) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-200 to-pink-200 rounded-[2.5rem] blur opacity-30 pointer-events-none"></div>

      <div className="relative rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-rose-100/50 border border-rose-50 overflow-hidden">
        
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-300 via-pink-500 to-rose-300"></div>

        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4 shadow-sm border border-rose-100">
                <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 font-sans tracking-tight">Acceso Admin</h1>
            <p className="text-sm text-neutral-400 font-medium mt-1">Panel de Control</p>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            
            {/* Email */}
            <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    disabled={checking || loading}
                />
            </div>

            {/* Password */}
            <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    placeholder="••••••••"
                    disabled={checking || loading}
                />
            </div>

            {/* Error Message */}
            {err && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                    <AlertCircle size={16} />
                    <span className="font-medium">{err}</span>
                </div>
            )}

            {/* Submit Button */}
            <button
                className="group relative w-full mt-2 flex items-center justify-center gap-2 bg-neutral-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-neutral-300 hover:shadow-rose-200"
                type="submit"
                disabled={checking || loading}
            >
                {checking || loading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>
                        <span>Ingresar</span>
                        <ShieldCheck size={18} className="text-white/50 group-hover:text-white transition-colors"/>
                    </>
                )}
            </button>
        </form>

        {/* Footer Card */}
        <div className="mt-8 text-center space-y-4">
            <div className="text-[10px] text-neutral-400 font-medium bg-neutral-50 py-1 px-3 rounded-full inline-block border border-neutral-100">
                {hint}
            </div>

            <a 
                href="/" 
                className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
            >
                <ArrowLeft size={14} /> Volver al sitio
            </a>
        </div>
      </div>
    </section>
  );
}