import React from 'react';

interface FancyButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FancyButton: React.FC<FancyButtonProps> = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="relative font-sans text-base sm:text-lg rounded-full px-6 py-3 z-10 text-white overflow-hidden border-none transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-lg whitespace-nowrap"
    >
      {/* Effet glass + contenu */}
      <span className="absolute inset-0 leading-[3rem] rounded-full bg-gradient-to-r from-white/30 to-gray-400/25 z-10 backdrop-blur-sm transition-all duration-300 hover:from-white/40 hover:to-gray-400/35 active:from-white/50 active:to-gray-400/45" />
      <span className="relative z-20 flex items-center justify-center gap-2">
        <span>{label}</span>
        {icon && <span>{icon}</span>}
      </span>

      {/* Blobs d’arrière-plan */}
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-0 top-0 bg-gradient-to-r from-gray-800 to-black hover:scale-125"></div>
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-7 top-0 bg-gradient-to-r from-gray-600 to-gray-800 hover:scale-125"></div>
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-16 -top-4 bg-gradient-to-r from-gray-400 to-gray-600 hover:scale-125"></div>
      <div className="absolute z-0 rounded-full w-20 h-12 transition-transform duration-300 ease-in-out left-[17rem] top-6 bg-gradient-to-r from-black to-gray-700 hover:scale-125"></div>
    </button>
  );
};

export default FancyButton;
