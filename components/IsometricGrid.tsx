import React from 'react';
import { Entity } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, TILE_WIDTH, TILE_HEIGHT } from '../constants';
import { codexData } from '../constants';

interface GameEntityProps {
  entity: Entity;
  onClick: () => void;
}

const GameEntity: React.FC<GameEntityProps> = ({ entity, onClick }) => {
  const codexEntry = codexData.find(e => e.id === entity.codexId);

  if (!codexEntry) {
    return (
        <div onClick={onClick} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 cursor-pointer group flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-500 border-2 border-purple-300 flex items-center justify-center text-white font-bold rounded-full">?</div>
        </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 cursor-pointer group flex items-center justify-center"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div 
        className="w-full h-full group-hover:scale-110 transition-transform"
        dangerouslySetInnerHTML={{ __html: codexEntry.svg_code }}
      />
    </div>
  );
};


interface IsometricGridProps {
  entities: Entity[];
  onEntityClick: (entity: Entity) => void;
}

const IsometricGrid: React.FC<IsometricGridProps> = ({ entities, onEntityClick }) => {
  
  const offsetX = (GRID_HEIGHT) * (TILE_WIDTH / 2);
  
  const gridCells = Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, i) => {
    const x = i % GRID_WIDTH;
    const y = Math.floor(i / GRID_WIDTH);
    return (
        <div key={`${x}-${y}`} className="absolute w-16 h-8"
             style={{
                 left: `${offsetX + (x - y) * (TILE_WIDTH / 2)}px`,
                 top: `${(x + y) * (TILE_HEIGHT / 2)}px`,
             }}>
             <div className="absolute inset-0 bg-slate-700/20 border-t border-l border-slate-600/30 group">
                <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
        </div>
    );
  });
  
  return (
    <div className="flex items-center justify-center w-full h-full scale-75 md:scale-90 lg:scale-100">
      <div className="relative" style={{
        width: `${(GRID_WIDTH + GRID_HEIGHT) * (TILE_WIDTH / 2)}px`,
        height: `${(GRID_WIDTH + GRID_HEIGHT) * (TILE_HEIGHT / 2)}px`,
      }}>
        {gridCells}
        {entities.map(entity => (
          <div key={entity.id} className="absolute w-16 h-8"
               style={{
                   left: `${offsetX + (entity.x - entity.y) * (TILE_WIDTH / 2)}px`,
                   top: `${(entity.x + entity.y) * (TILE_HEIGHT / 2)}px`,
                   zIndex: entity.y * GRID_WIDTH + entity.x
               }}>
              <GameEntity entity={entity} onClick={() => onEntityClick(entity)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IsometricGrid;