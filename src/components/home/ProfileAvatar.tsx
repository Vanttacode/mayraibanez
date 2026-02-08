interface Props {
  src?: string | null;
  alt: string;
}

export default function ProfileAvatar({ src, alt }: Props) {
  return (
    // Usamos 'group' para animar el glow al pasar el mouse
    <div className="relative group cursor-pointer z-30">
      {/* El "Glow" o halo rosa detrás del avatar */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-full opacity-70 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>
      
      {/* El contenedor de la imagen principal */}
      {/* Aumentamos tamaño: w-40 en móvil, w-52 en desktop. Borde blanco grueso (border-4) */}
      <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full p-1 bg-white border-[5px] border-white shadow-2xl shadow-rose-500/30 overflow-hidden">
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          // Placeholder si no hay foto
          <div className="w-full h-full bg-rose-100 flex items-center justify-center flex-col text-rose-400 font-bold">
            <span className="text-4xl">?</span>
          </div>
        )}
      </div>
    </div>
  );
}