"use client";

import React, { useState } from "react";
import type { Profile } from "@/lib/types";
import { Sparkles, Send, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Inicialización de Supabase manejando compatibilidad de variables de entorno (Astro/Next)
const supabaseUrl = 
  (typeof process !== "undefined" && process.env.PUBLIC_SUPABASE_URL) || 
  (typeof import.meta !== "undefined" && (import.meta as any).env?.PUBLIC_SUPABASE_URL) || 
  "";

const supabaseKey = 
  (typeof process !== "undefined" && process.env.PUBLIC_SUPABASE_ANON_KEY) || 
  (typeof import.meta !== "undefined" && (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY) || 
  "";

const defaultSiteHandle = 
  (typeof process !== "undefined" && process.env.PUBLIC_SITE_HANDLE) || 
  (typeof import.meta !== "undefined" && (import.meta as any).env?.PUBLIC_SITE_HANDLE) || 
  "mayraibanez";

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
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name,
            sender_email: formData.senderEmail,
            service_type: formData.serviceType,
            company: formData.company,
            message: formData.message,
            site_handle: defaultSiteHandle
          }
        ]);

      if (error) {
        throw error;
      }

      setStatus("success");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setStatus("error");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-rose-100/40 border border-rose-50 text-center group transition-all hover:border-rose-200">
      
      {/* Fondo decorativo animado */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 via-pink-500 to-rose-300"></div>
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tl from-rose-50 to-transparent blur-3xl opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Icono Principal */}
        <div className="mb-4 bg-rose-50 rounded-full p-3 text-rose-500 shadow-sm transition-transform duration-500">
             {status === "success" ? <CheckCircle2 size={24} /> : <Sparkles size={24} />}
        </div>

        <h3 className="text-xl font-bold text-neutral-800 tracking-tight font-sans mb-2">
            {status === "success" ? "Mensaje Enviado" : "Trabajemos Juntos"}
        </h3>

        {status === "success" ? (
          <div className="mt-4 text-neutral-500 text-sm animate-fade-in">
            <p>Gracias por tu interes.</p>
            <p>Me pondre en contacto contigo pronto.</p>
            <button 
              onClick={() => { setStatus("idle"); setFormData({ name: "", senderEmail: "", serviceType: "Publicidad", company: "", message: "" }); }}
              className="mt-6 text-rose-500 font-medium text-xs underline hover:text-rose-600"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium mb-6 max-w-[280px]">
              ¿Tienes una marca o evento? Escribeme y creemos algo increible juntos.
            </p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 text-left">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="sr-only">Nombre</label>
                  <input required type="text" id="name" name="name" placeholder="Tu Nombre" value={formData.name} onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-neutral-50/50" />
                </div>
                <div>
                  <label htmlFor="company" className="sr-only">Marca/Empresa</label>
                  <input required type="text" id="company" name="company" placeholder="Marca/Empresa" value={formData.company} onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-neutral-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="senderEmail" className="sr-only">Tu Email</label>
                  <input required type="email" id="senderEmail" name="senderEmail" placeholder="Tu Email" value={formData.senderEmail} onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-neutral-50/50" />
                </div>
                <div>
                  <label htmlFor="serviceType" className="sr-only">Servicio</label>
                  <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-neutral-50/50 text-neutral-600">
                    <option value="Publicidad">Publicidad</option>
                    <option value="Evento">Evento</option>
                    <option value="Colaboracion">Colaboracion</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="sr-only">Detalles</label>
                <textarea required id="message" name="message" rows={3} placeholder="Presupuesto estimado, fechas, detalles..." value={formData.message} onChange={handleChange} 
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-neutral-50/50 resize-none"></textarea>
              </div>

              {status === "error" && (
                <p className="text-red-500 text-xs text-center">Hubo un error al enviar el mensaje. Intenta de nuevo.</p>
              )}

              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-neutral-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Enviar Propuesta</>}
              </button>

            </form>
          </>
        )}

        {/* Admin Link Oculto */}
        <a href="/admin" className="absolute top-4 right-4 text-neutral-200 hover:text-rose-300 transition-colors p-2">
            <span className="sr-only">Admin</span>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
        </a>

      </div>
    </section>
  );
}