import React from 'react';

interface FancyButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FancyButtonDark: React.FC<FancyButtonProps> = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="relative font-sans text-base sm:text-lg rounded-full px-6 py-3 z-10 text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-lg whitespace-nowrap"
    >
      {/* Effet sombre + contenu */}
      <span className="absolute inset-0 leading-[3rem] rounded-full bg-gradient-to-r from-black/30 to-gray-700/25 z-10 backdrop-blur-sm transition-all duration-300 hover:from-black/40 hover:to-gray-600/35 active:from-black/50 active:to-gray-500/45" />
      <span className="relative z-20 flex items-center justify-center gap-2">
        <span>{label}</span>
        {icon && <span>{icon}</span>}
      </span>

      {/* Blobs d’arrière-plan version sombre */}
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-0 top-0 bg-gradient-to-r from-gray-900 to-black hover:scale-125"></div>
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-7 top-0 bg-gradient-to-r from-gray-800 to-gray-900 hover:scale-125"></div>
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-16 -top-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:scale-125"></div>
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-[17rem] top-6 bg-gradient-to-r from-black to-gray-900 hover:scale-125"></div>
    </button>
  );
};

export default FancyButtonDark;
