import { useState, useEffect } from 'react';

interface Props {
  images: (string | null | undefined)[];
}

export default function CoverSlider({ images }: Props) {
  const validImages = images.filter((img): img is string => !!img && img.length > 0);

  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-[380px] bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [validImages.length]);

  return (
    <div className="relative w-full h-[380px] overflow-hidden bg-neutral-900">
      {validImages.map((src, index) => (
        <div
          key={src + index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={src}
            alt={`Cover slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 z-20 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-pink-900/30 mix-blend-multiply"></div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-rose-50 to-transparent z-30"></div>
    </div>
  );
}