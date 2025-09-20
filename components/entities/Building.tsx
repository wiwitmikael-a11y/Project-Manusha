
import React from 'react';

interface BuildingProps {
  onClick: () => void;
}

const Building: React.FC<BuildingProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-16 cursor-pointer group iso-child"
    >
      <div className="absolute bottom-0 left-0 w-8 h-12 bg-slate-600 border-2 border-slate-400 group-hover:border-cyan-300 transition-colors"></div>
      <div className="absolute bottom-4 left-4 w-6 h-10 bg-slate-700 border-2 border-slate-500 group-hover:border-cyan-400 transition-colors"></div>
    </div>
  );
};

export default Building;
