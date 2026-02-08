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
      // fallback
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
    // En Instagram/Threads no hay “compartir link” universal.
    // Esto usa el share nativo del teléfono cuando existe.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await onCopy();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onNativeShare}
        className="inline-flex items-center gap-2 rounded-2xl bg-white text-black font-semibold text-sm px-3 py-2 hover:opacity-90 transition"
      >
        <Share2 size={16} />
        Compartir
      </button>

      <button
        onClick={onCopy}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-sm px-3 py-2 hover:bg-white/10 transition"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copiado" : "Copiar link"}
      </button>

      <a
        href={links.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-sm px-3 py-2 hover:bg-white/10 transition"
      >
        <MessageCircle size={16} />
        WhatsApp
      </a>

      <a
        href={links.x}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-sm px-3 py-2 hover:bg-white/10 transition"
      >
        <Twitter size={16} />
        X
      </a>

      <a
        href={links.facebook}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-sm px-3 py-2 hover:bg-white/10 transition"
      >
        <Facebook size={16} />
        Facebook
      </a>
    </div>
  );
}
