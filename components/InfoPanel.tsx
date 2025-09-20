import React from 'react';
import { Entity, Character, CodexEntityType } from '../types';
import { codexData } from '../constants';
import { HeartIcon, CubeIcon, UserIcon, CogIcon } from './icons/Icons';
import ChibiSprite from './ChibiSprite';

interface InfoPanelProps {
  entity: Entity;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ entity, onClose }) => {
  const codexEntry = codexData.find(e => e.id === entity.codexId);

  if (!codexEntry) {
    return (
        <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center" onClick={onClose}>
            <div 
              className="relative bg-slate-800 p-6 rounded-lg w-full max-w-sm" 
              onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-cyan-300 transition-colors">&times;</button>
                <p>Unknown Entity Data</p>
                <p className="text-xs text-slate-500">{entity.id}</p>
            </div>
        </div>
    );
  }

  const getIcon = () => {
    switch(codexEntry.type) {
        case CodexEntityType.CHARACTER: return <UserIcon className="w-5 h-5"/>;
        case CodexEntityType.STRUCTURE:
        case CodexEntityType.ENVIRONMENT:
        default: return <CubeIcon className="w-5 h-5"/>;
    }
  };
  
  const renderEntityVisual = () => {
    const isCharacter = codexEntry.type === CodexEntityType.CHARACTER || codexEntry.type === CodexEntityType.NPC;
    const visualAttrs = codexEntry.attributes?.visuals;

    if (isCharacter && visualAttrs) {
      return <ChibiSprite
        base={visualAttrs.base}
        hair={visualAttrs.hair}
        outfit={visualAttrs.outfit}
        weapon={visualAttrs.weapon}
        className="w-full h-full"
      />
    }
    return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: codexEntry.svg_code }}></div>;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center" onClick={onClose}>
      <div 
        className="relative bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 rounded-lg shadow-xl shadow-cyan-500/10 w-full max-w-sm p-6 transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-cyan-300 transition-colors text-2xl leading-none">&times;</button>
        
        <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">{getIcon()}{codexEntry.name}</h3>
        <p className="text-sm text-slate-400 capitalize">{codexEntry.category.replace(/_/g, ' ')}</p>
        
        <div className="w-full h-32 bg-slate-900/50 rounded-lg flex items-center justify-center p-2 my-4">
          {renderEntityVisual()}
        </div>

        <p className="text-sm text-slate-300 mb-4">{codexEntry.description}</p>

        {entity.hp !== undefined && entity.maxHp !== undefined && (
            <div className="flex items-center gap-2 text-sm mb-2">
                <HeartIcon className="w-4 h-4 text-red-400"/> Health: {entity.hp} / {entity.maxHp}
            </div>
        )}

        {entity.type === CodexEntityType.CHARACTER && (
            <div className="flex items-center gap-2 text-sm mb-4">
                <CogIcon className="w-4 h-4 text-yellow-400"/> Action: {(entity as Character).action}
            </div>
        )}

        {codexEntry.attributes && (
            <div>
                <h4 className="font-bold text-slate-200 mb-2 text-sm">Base Attributes</h4>
                <div className="space-y-1 text-xs">
                    {Object.entries(codexEntry.attributes).filter(([key]) => key !== 'visuals').map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-slate-700 py-1">
                            <span className="capitalize text-slate-400">{key.replace(/_/g, ' ')}</span>
                            <span className="font-mono font-bold text-cyan-300">{Array.isArray(value) ? value.join(', ') : value.toString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;