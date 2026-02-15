import React, { useMemo, useState, useEffect } from "react";
import { Share2, Copy, Check, Facebook, MessageCircle } from "lucide-react";

// Icono X (Twitter) personalizado
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h.001Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [realUrl, setRealUrl] = useState(url);

  // EFECTO: Corregir URL si estamos en el cliente (para evitar compartir 'localhost')
  useEffect(() => {
    if (typeof window !== "undefined") {
       // Usamos la URL actual del navegador, que siempre es la correcta
       setRealUrl(window.location.href);
    }
  }, []);

  const links = useMemo(() => {
    const u = encodeURIComponent(realUrl);
    const t = encodeURIComponent(title);
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${realUrl}`)}`,
      x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, // X usa la misma API base
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    };
  }, [title, realUrl]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(realUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = realUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  async function onNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: realUrl });
      } catch {}
    } else {
      await onCopy();
    }
  }

  // Estilos Barbie: Rosa fuerte, bordes, mayúsculas
  const btnBase = "inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-pink-500 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:shadow-md active:scale-95";

  return (
    <div className="flex flex-col gap-3">
      
      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest pl-1">
        ¡Compártelo con tus amigas! 💕
      </span>

      <div className="flex flex-wrap gap-2">
        {/* Botón Principal: Compartir Nativo */}
        <button
          onClick={onNativeShare}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-pink-200 transition-all hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-pink-300"
        >
          <Share2 size={14} />
          Compartir
        </button>

        {/* Botón WhatsApp */}
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noreferrer"
          className={btnBase}
          aria-label="Compartir en WhatsApp"
        >
          <MessageCircle size={14} />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Botón X (Twitter) */}
        <a
          href={links.x}
          target="_blank"
          rel="noreferrer"
          className={btnBase}
          aria-label="Compartir en X"
        >
          <XIcon size={12} />
        </a>

        {/* Botón Facebook */}
        <a
          href={links.facebook}
          target="_blank"
          rel="noreferrer"
          className={btnBase}
          aria-label="Compartir en Facebook"
        >
          <Facebook size={14} />
        </a>

        {/* Botón Copiar Link */}
        <button
          onClick={onCopy}
          className={`
            ${btnBase} 
            ${copied ? "!bg-green-400 !text-white !border-green-400" : ""}
          `}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "¡Listo!" : "Copiar"}
        </button>
      </div>
    </div>
  );
}