import React from 'react';
import { Entity, CodexEntityType } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, TILE_WIDTH, TILE_HEIGHT } from '../constants';
import { codexData } from '../constants';
import ChibiSprite from './ChibiSprite';

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
  
  const isCharacter = codexEntry.type === CodexEntityType.CHARACTER || codexEntry.type === CodexEntityType.NPC;
  const visualAttrs = codexEntry.attributes?.visuals;

  return (
    <div
      onClick={onClick}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 cursor-pointer group flex items-center justify-center"
      style={{ transform: 'translateX(-50%)' }}
    >
      {isCharacter && visualAttrs ? (
        <ChibiSprite 
          base={visualAttrs.base}
          hair={visualAttrs.hair}
          outfit={visualAttrs.outfit}
          weapon={visualAttrs.weapon}
          className="w-full h-full group-hover:scale-110 transition-transform"
        />
      ) : (
        <div 
          className="w-full h-full group-hover:scale-110 transition-transform"
          dangerouslySetInnerHTML={{ __html: codexEntry.svg_code }}
        />
      )}
    </div>
  );
};


interface IsometricGridProps {
  entities: Entity[];
  onEntityClick: (entity: Entity) => void;
  view: { zoom: number; pan: { x: number; y: number } };
}

const IsometricGrid: React.FC<IsometricGridProps> = ({ entities, onEntityClick, view }) => {
  
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
    <div 
        className="flex items-center justify-center w-full h-full"
        style={{ transform: `translate(${view.pan.x}px, ${view.pan.y}px) scale(${view.zoom})` }}
    >
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