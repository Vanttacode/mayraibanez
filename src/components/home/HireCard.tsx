import React from "react";
import type { Profile } from "@/lib/types";
import { Mail, ArrowRight, Sparkles } from "lucide-react";

export default function HireCard({ profile }: { profile: Profile }) {
  // Aseguramos que use el correo correcto, incluso si viene vacío del perfil
  const email = profile.email || "mayraibanezcontacto@gmail.com";
  
  const mailto = `mailto:${email}?subject=${encodeURIComponent("Propuesta Comercial / Contratación")}&body=${encodeURIComponent(
    `Hola Mayra,\n\nMe gustaría contactarte para:\n\n- Tipo de servicio (Publicidad/Evento/Colab):\n- Marca/Empresa:\n- Fecha tentativa:\n- Presupuesto estimado:\n\nQuedo atento/a a tu respuesta.\nSaludos.`
  )}`;

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-rose-100/40 border border-rose-50 text-center group transition-all hover:border-rose-200">
      
      {/* Fondo decorativo animado */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-300 via-pink-500 to-rose-300"></div>
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tl from-rose-50 to-transparent blur-3xl opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Icono Principal */}
        <div className="mb-4 bg-rose-50 rounded-full p-3 text-rose-500 shadow-sm group-hover:scale-110 transition-transform duration-500">
             <Sparkles size={24} />
        </div>

        <h3 className="text-xl font-bold text-neutral-800 tracking-tight font-sans mb-2">
            Trabajemos Juntos
        </h3>

        {/* Servicios Clave (Pills) */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-500 text-[10px] font-bold uppercase tracking-wider border border-neutral-100">Publicidad</span>
            <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-500 text-[10px] font-bold uppercase tracking-wider border border-neutral-100">Eventos</span>
            <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-500 text-[10px] font-bold uppercase tracking-wider border border-neutral-100">Colaboraciones</span>
        </div>
        
        <p className="text-sm text-neutral-500 leading-relaxed font-medium mb-6 max-w-[280px]">
          ¿Tienes una marca o evento? Escríbeme y creemos algo increíble juntos.
        </p>

       

        {/* Email visible por si quieren copiarlo */}
        <div className="mt-3 pt-3 border-t border-neutral-300 w-full">
            <p className="text-xs text-neutral-400 font-medium select-all cursor-text hover:text-rose-500 transition-colors">
                {email}
            </p>
        </div>

        {/* Admin Link (Oculto visualmente, solo hover en la esquina) */}
        <a href="/admin" className="absolute top-4 right-4 text-neutral-200 hover:text-rose-300 transition-colors p-2">
            <span className="sr-only">Admin</span>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
        </a>

      </div>
    </section>
  );
}