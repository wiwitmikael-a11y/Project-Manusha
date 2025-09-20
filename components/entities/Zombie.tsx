
import React from 'react';

interface ZombieProps {
  onClick: () => void;
}

const Zombie: React.FC<ZombieProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 cursor-pointer group iso-child"
    >
        <div className="absolute w-full h-full flex flex-col items-center justify-end">
        {/* Head */}
        <div className="w-3 h-3 bg-red-500 border border-red-300 rounded-full group-hover:scale-110 transition-transform"></div>
        {/* Body */}
        <div className="w-2 h-4 bg-red-700 border border-red-500"></div>
      </div>
    </div>
  );
};

export default Zombie;
