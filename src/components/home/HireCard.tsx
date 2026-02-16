import React, { useMemo, useState } from "react";
import type { Profile } from "@/lib/types";
import { Sparkles, Send, Loader2, CheckCircle2, AlertCircle, Mail, Crown } from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lógica de Cliente Supabase
 */
type Status = "idle" | "loading" | "success" | "error";

function buildSupabase(): SupabaseClient {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error("Faltan variables de entorno de Supabase");
  }
  return createClient(url, anon);
}

export default function HireCard({ profile }: { profile: Profile }) {
  const supabase = useMemo(() => buildSupabase(), []);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    senderEmail: "",
    serviceType: "Publicidad",
    company: "",
    message: "",
    website: "", // Honeypot
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      // Honeypot check
      if (formData.website.trim().length > 0) {
        setStatus("success");
        resetForm();
        return;
      }

      if (!formData.senderEmail.includes("@")) {
        throw new Error("Email inválido.");
      }

      const siteHandle = (profile as any)?.handle as string | undefined;

      const payload: Record<string, any> = {
        name: formData.name.trim(),
        sender_email: formData.senderEmail.trim(),
        service_type: formData.serviceType,
        company: formData.company.trim() || null,
        message: formData.message.trim(),
      };

      if (siteHandle && siteHandle.trim().length > 0) {
        payload.site_handle = siteHandle.trim();
      }

      const { error } = await supabase
        .from("contact_messages")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      setStatus("success");
      resetForm();

    } catch (err: any) {
      const msg = err?.message || "Error al enviar. Intenta de nuevo.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      senderEmail: "",
      serviceType: "Publicidad",
      company: "",
      message: "",
      website: "",
    });
  };

  // Clases compartidas para los inputs (Estilo Barbie Clean)
  const inputClass = "w-full px-4 py-3 text-sm bg-white border-2 border-pink-100 rounded-xl focus:outline-none focus:bg-pink-50/30 focus:border-pink-300 focus:shadow-md transition-all placeholder:text-pink-300 text-pink-600 font-medium";

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-pink-200/50 border-2 border-pink-100 text-center group">
      
      {/* Decoración Superior Gradient */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-rose-500 to-pink-300"></div>
      
      {/* Decoración de fondo (Glow Barbie) */}
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tl from-pink-100 to-transparent blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Icono de Estado */}
        <div className={`mb-4 rounded-full p-4 shadow-sm border-2 transition-all duration-500 ${status === "success" ? "bg-green-50 text-green-500 border-green-100" : "bg-pink-50 text-pink-500 border-pink-100"}`}>
          {status === "success" ? <CheckCircle2 size={32} /> : <Crown size={32} />}
        </div>

        {/* Título Sticker */}
        <h3 className="text-3xl font-extrabold text-pink-500 tracking-tight mb-2 font-script" 
            style={{ textShadow: "2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff" }}>
          {status === "success" ? "¡Mensaje Enviado!" : "Trabajemos Juntos"}
        </h3>

        {status === "success" ? (
          <div className="mt-4 text-pink-500 text-sm animate-fade-in px-4">
            <p className="font-extrabold text-pink-600 mb-2 text-lg">¡Gracias por escribir! 💕</p>
            <p className="leading-relaxed font-medium">Tu propuesta llegó a mi bandeja de entrada.<br/>Te responderé lo antes posible.</p>
            
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 px-6 py-2 rounded-full border-2 border-pink-200 text-pink-500 font-bold text-xs hover:bg-pink-50 hover:border-pink-300 transition-colors uppercase tracking-widest"
            >
              Enviar otra propuesta
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-pink-400 leading-relaxed font-bold mb-8 max-w-[300px]">
              ¿Tienes una marca o evento? ✨<br/>Completa los datos y hagamos magia.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
              {/* Honeypot (Oculto) */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Tu Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  required
                  type="text"
                  name="company"
                  placeholder="Marca / Empresa"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  name="senderEmail"
                  placeholder="Tu Email"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
                <div className="relative">
                    <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                    >
                    <option value="Publicidad">Publicidad</option>
                    <option value="Evento">Evento</option>
                    <option value="Colaboración">Colaboración</option>
                    </select>
                    {/* Flecha custom rosa */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
              </div>

              <textarea
                required
                name="message"
                rows={3}
                placeholder="Cuéntame los detalles, fechas o presupuesto..."
                value={formData.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-xs justify-center bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                  <AlertCircle size={16} />
                  <span className="font-medium">{errorMsg || "Error al enviar. Intenta de nuevo."}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="group/btn relative w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl text-sm font-extrabold tracking-wide hover:shadow-lg hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md border-2 border-white"
              >
                {status === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">ENVIAR PROPUESTA</span>
                    <Send size={16} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}