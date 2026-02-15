import React, { useMemo, useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const links = useMemo(() => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    };
  }, [title, url]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback tradicional
      const ta = document.createElement("textarea");
      ta.value = url;
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
        await navigator.share({ title, url });
      } catch {}
    } else {
      await onCopy();
    }
  }

  // Clases base para los botones secundarios (Estilo Pill Glossy)
  const btnBase = "inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-neutral-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-500 hover:shadow-md active:scale-95";

  return (
    <div className="flex flex-col gap-3">
      
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
        Compartir artículo
      </span>

      <div className="flex flex-wrap gap-2">
        {/* Botón Principal: Compartir Nativo */}
        <button
          onClick={onNativeShare}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-neutral-200 transition-all hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-rose-200"
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

        {/* Botón X / Twitter */}
        <a
          href={links.x}
          target="_blank"
          rel="noreferrer"
          className={btnBase}
          aria-label="Compartir en X"
        >
          <Twitter size={14} />
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
            ${copied ? "!bg-green-50 !text-green-600 !border-green-200" : ""}
          `}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copiado" : "Link"}
        </button>
      </div>
    </div>
  );
}