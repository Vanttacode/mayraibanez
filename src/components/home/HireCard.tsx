import React, { useMemo, useState } from "react";
import type { Profile } from "@/lib/types";
import { Sparkles, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Astro note:
 * - No necesitás "use client" (eso es de Next). En Astro la interactividad la define client:* al importarlo.
 */

type Status = "idle" | "loading" | "success" | "error";

function buildSupabase(): SupabaseClient {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error("Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY");
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
    // Honeypot (bots lo suelen llenar)
    website: "",
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
      // Anti-spam simple: si el honeypot viene lleno, cortamos silencioso
      if (formData.website.trim().length > 0) {
        setStatus("success");
        setFormData({
          name: "",
          senderEmail: "",
          serviceType: "Publicidad",
          company: "",
          message: "",
          website: "",
        });
        return;
      }

      // Validación mínima
      if (!formData.senderEmail.includes("@")) {
        throw new Error("Email inválido.");
      }

      // ✅ site_handle:
      // - Si profile.handle existe, lo mandamos
      // - Si no existe, NO lo mandamos para que aplique el DEFAULT de la tabla (mayraibanez)
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

      const { data, error } = await supabase
        .from("contact_messages")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("[contact_messages] insert error", {
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
          code: (error as any).code,
        });
        throw error;
      }

      console.log("[contact_messages] inserted", data);

      setStatus("success");
      setFormData({
        name: "",
        senderEmail: "",
        serviceType: "Publicidad",
        company: "",
        message: "",
        website: "",
      });
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.error_description ||
        "Error al enviar. Intenta de nuevo.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-rose-100/40 border border-rose-50 text-center group transition-all hover:border-rose-200">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 via-pink-500 to-rose-300"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 bg-rose-50 rounded-full p-3 text-rose-500 shadow-sm transition-transform duration-500">
          {status === "success" ? <CheckCircle2 size={24} /> : <Sparkles size={24} />}
        </div>

        <h3 className="text-xl font-bold text-neutral-800 tracking-tight mb-2">
          {status === "success" ? "¡Propuesta Recibida!" : "Trabajemos Juntos"}
        </h3>

        {status === "success" ? (
          <div className="mt-4 text-neutral-500 text-sm animate-fade-in px-4">
            <p className="font-bold text-rose-500 mb-1">Gracias por contactarme.</p>
            <p>He recibido tu mensaje y te responderé al correo lo antes posible.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-rose-500 font-bold text-xs underline hover:text-rose-600 uppercase tracking-widest"
            >
              Enviar otra propuesta
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium mb-6 max-w-[280px]">
              ¿Tienes una marca o evento? Completa los datos y hablemos.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 text-left">
              {/* Honeypot */}
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

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Tu Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50"
                />
                <input
                  required
                  type="text"
                  name="company"
                  placeholder="Marca/Empresa"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="email"
                  name="senderEmail"
                  placeholder="Tu Email"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50"
                />
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50 text-neutral-600"
                >
                  <option value="Publicidad">Publicidad</option>
                  <option value="Evento">Evento</option>
                  <option value="Colaboración">Colaboración</option>
                </select>
              </div>

              <textarea
                required
                name="message"
                rows={3}
                placeholder="Detalles, presupuesto, fechas..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 resize-none bg-neutral-50/50"
              />

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-xs justify-center bg-red-50 p-2 rounded-lg">
                  <AlertCircle size={14} />
                  <span>{errorMsg || "Error al enviar. Intenta de nuevo."}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-neutral-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Enviar Propuesta
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
