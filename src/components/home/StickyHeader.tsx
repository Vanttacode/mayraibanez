import React, { useState, useEffect } from "react";

interface Props {
  logoUrl: string;
  communityHref: string;
  blogHref?: string;
}

export default function StickyHeader({ logoUrl, communityHref, blogHref = "/blog" }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const btnBase =
    "text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wide border transition-transform hover:scale-105";

  return (
    <nav
      className={`absolute top-0 left-0 w-full z-50 transition-all duration-500 px-5 py-4 flex items-center justify-between
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm rounded-b-2xl" : "bg-gradient-to-b from-black/60 to-transparent"}
      `}
    >
      <div className="flex items-center">
        <img
          src={logoUrl}
          alt="Logo"
          className={`h-8 w-auto object-contain transition-all duration-300 
            ${scrolled ? "brightness-0 saturate-100" : "drop-shadow-md brightness-0 invert"}
          `}
          style={
            scrolled
              ? { filter: "brightness(0) saturate(100%) invert(38%) sepia(63%) saturate(3047%) hue-rotate(302deg) brightness(97%) contrast(96%)" }
              : {}
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <a
          href={blogHref}
          className={[
            btnBase,
            scrolled
              ? "bg-white text-neutral-900 border-rose-200 hover:bg-rose-50"
              : "bg-white/15 text-white border-white/25 hover:bg-white/25",
          ].join(" ")}
        >
          Mini Blog
        </a>

        <a
          href={communityHref}
          target="_blank"
          rel="noreferrer"
          className={[
            btnBase,
            "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg border-white/20",
          ].join(" ")}
        >
          Comunidad
        </a>
      </div>
    </nav>
  );
}
