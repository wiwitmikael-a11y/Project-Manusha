
import React from 'react';

interface SurvivorProps {
  onClick: () => void;
}

const Survivor: React.FC<SurvivorProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 cursor-pointer group iso-child"
    >
      <div className="absolute w-full h-full flex flex-col items-center justify-end">
        {/* Head */}
        <div className="w-3 h-3 bg-green-400 border border-green-200 rounded-full group-hover:scale-110 transition-transform"></div>
        {/* Body */}
        <div className="w-2 h-4 bg-green-600 border border-green-400"></div>
      </div>
    </div>
  );
};

export default Survivor;
