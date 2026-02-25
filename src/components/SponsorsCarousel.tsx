import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BrandItem = {
  name: string;
  logo_url: string;
  href?: string | null;
};

const items: BrandItem[] = [
  { name: "Incidencia", logo_url: "/logos/1.webp", href: null },
  { name: "Palermo Teatro Bar", logo_url: "/logos/3.webp", href: null },
  { name: "Happy Shopping", logo_url: "/logos/25.jpg", href: null },
  { name: "EMP RENT A CAR", logo_url: "/logos/22.png", href: null },
  { name: "Tiendas One", logo_url: "/logos/6.webp", href: null },
  { name: "ROFIL", logo_url: "/logos/8.webp", href: null },
  { name: "Coco Producciones", logo_url: "/logos/11.webp", href: null },
  { name: "Santo Tomas", logo_url: "/logos/12.webp", href: null },
  { name: "Agua Nozomu", logo_url: "/logos/13.jpg", href: null },
];

export default function SponsorsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section className="w-full py-10 px-4 max-w-2xl mx-auto">
      {/* TÍTULO REFINADO */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tighter text-slate-800 flex items-center justify-center gap-3">
          <span className="text-pink-500">MIS</span> 
          <span className="relative">
            SPONSORS
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-pink-100 -z-10"></span>
          </span>
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mt-2">
          Partners & Colaboraciones
        </p>
      </div>

      {/* STAGE DEL CAROUSEL */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
          
          {/* Fondo Decorativo Sutil */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#ec4899_0%,_transparent_70%)]"></div>
          </div>

          {/* Slider Track */}
          <div 
            className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div 
                key={index} 
                className="w-full h-full flex-shrink-0 flex items-center justify-center p-8 md:p-12"
              >
                {item.href ? (
                  <a 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-500"
                  >
                    <img src={item.logo_url} alt={item.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                  </a>
                ) : (
                  <img src={item.logo_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                )}
              </div>
            ))}
          </div>

          {/* Flechas de Navegación (Minimal) */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-pink-500 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-pink-500 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicadores de Progreso Estilizados */}
        <div className="flex justify-center gap-3 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`group relative h-1 transition-all duration-500 ${
                index === currentIndex ? "w-12 bg-pink-500" : "w-4 bg-slate-200 hover:bg-pink-200"
              } rounded-full overflow-hidden`}
            >
              {index === currentIndex && (
                <span className="absolute inset-0 bg-white/30 animate-progress"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 4s linear infinite;
        }
      `}</style>
    </section>
  );
}