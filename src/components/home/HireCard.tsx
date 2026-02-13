"use client";

import React, { useState } from "react";
import type { Profile } from "@/lib/types";
import { Sparkles, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Inicialización del cliente
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HireCard({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    senderEmail: "",
    serviceType: "Publicidad",
    company: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Guardamos en la tabla (Esto disparará el Webhook que configuraste)
      const { error } = await supabase
        .from("contact_messages")
        .insert([{
          name: formData.name,
          sender_email: formData.senderEmail,
          service_type: formData.serviceType,
          company: formData.company,
          message: formData.message,
          site_handle: "mayra" 
        }]);

      if (error) throw error;
      setStatus("success");
      
      // Limpiamos el formulario tras éxito
      setFormData({ name: "", senderEmail: "", serviceType: "Publicidad", company: "", message: "" });
    } catch (error) {
      console.error("Error al enviar:", error);
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
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" name="name" placeholder="Tu Nombre" value={formData.name} onChange={handleChange} 
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50" />
                <input required type="text" name="company" placeholder="Marca/Empresa" value={formData.company} onChange={handleChange} 
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input required type="email" name="senderEmail" placeholder="Tu Email" value={formData.senderEmail} onChange={handleChange} 
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50" />
                <select name="serviceType" value={formData.serviceType} onChange={handleChange} 
                  className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 bg-neutral-50/50 text-neutral-600">
                  <option value="Publicidad">Publicidad</option>
                  <option value="Evento">Evento</option>
                  <option value="Colaboración">Colaboración</option>
                </select>
              </div>

              <textarea required name="message" rows={3} placeholder="Detalles, presupuesto, fechas..." value={formData.message} onChange={handleChange} 
                className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-200 resize-none bg-neutral-50/50"></textarea>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-xs justify-center bg-red-50 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    <span>Error al enviar. Intenta de nuevo.</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-neutral-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-rose-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Enviar Propuesta</>}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}