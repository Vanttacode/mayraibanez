import { useState, useEffect } from 'react';

interface Props {
  images: (string | null | undefined)[];
}

export default function CoverSlider({ images }: Props) {
  const validImages = images.filter((img): img is string => !!img && img.length > 0);

  // Fallback "Barbie": Un degradado vibrante si no hay fotos
  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-rose-500 animate-gradient-xy">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
      }, 5000); // 5 segundos para más dinamismo
      return () => clearInterval(interval);
    }
  }, [validImages.length]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-pink-900">
      {validImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src + index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* IMAGEN CON EFECTO ZOOM (Ken Burns) */}
            <img
              src={src}
              alt={`Cover slide ${index + 1}`}
              className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* EL "FILTRO BARBIE": 
                Capa fucsia en modo 'overlay' para teñir las fotos de rosa vibrante 
                sin perder contraste. */}
            <div className="absolute inset-0 bg-fuchsia-500/20 mix-blend-overlay"></div>
            
            {/* Capa oscura suave para que el texto blanco (hora, wifi, etc) se lea */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        );
      })}

      {/* --- CAPAS DE DECORACIÓN Y FUSIÓN --- */}

      {/* 1. Header Shade: Oscuro arriba para el menú/logo */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/50 via-black/20 to-transparent z-20 pointer-events-none"></div>

      {/* 2. GLOW ROSA: Un brillo mágico en el centro */}
      <div className="absolute inset-0 z-20 bg-gradient-to-tr from-pink-500/10 via-transparent to-rose-400/20 mix-blend-screen pointer-events-none"></div>
      
      {/* 3. FUSIÓN INFERIOR (Suelo): 
          Se funde hacia el color de fondo de la app (rosa pálido/blanco) 
          para que la tarjeta de perfil parezca flotar en nubes rosas. */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-pink-50 via-pink-50/80 to-transparent z-30 pointer-events-none"></div>
    </div>
  );
}