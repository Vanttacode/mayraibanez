import { useState, useEffect } from 'react';

interface Props {
  images: (string | null | undefined)[];
}

export default function CoverSlider({ images }: Props) {
  const validImages = images.filter((img): img is string => !!img && img.length > 0);

  // Fallback si no hay imágenes (Degradado elegante)
  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
      }, 6000); // 6 segundos para dar tiempo al efecto de zoom
      return () => clearInterval(interval);
    }
  }, [validImages.length]);

  return (
    // CAMBIO CLAVE: h-full en lugar de h-[380px] para llenar el contenedor padre del index
    <div className="relative w-full h-full overflow-hidden bg-neutral-900">
      {validImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src + index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* EFECTO KEN BURNS (Zoom Lento):
                - transition-transform duration-[7000ms]: El zoom dura más que el slide.
                - scale-110: La imagen crece un 10% suavemente.
             */}
            <img
              src={src}
              alt={`Cover slide ${index + 1}`}
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Velo oscuro sutil para que el texto blanco resalte siempre */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        );
      })}

      {/* GRADIENTES DE FUSIÓN */}
      
      {/* 1. Sombra superior para que el Navbar y el logo blanco se lean bien */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none"></div>

      {/* 2. Tinte rosado "glam" general */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent mix-blend-overlay pointer-events-none"></div>
      
      {/* 3. Fusión inferior con el fondo de la página (Rose-50) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-rose-50 via-rose-50/60 to-transparent z-30 pointer-events-none"></div>
    </div>
  );
}