import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, Entity, CodexEntity, CodexEntityType, BaseEntity, Character, NPC } from './types';
import { GRID_WIDTH, GRID_HEIGHT, TICK_RATE, codexData, spawnEntitiesForBiome, getEntitiesByCategory, INITIAL_SURVIVORS } from './constants';
import IsometricGrid from './components/IsometricGrid';
import InfoPanel from './components/InfoPanel';
import EventModal from './components/EventModal';
import { generateGameEvent } from './services/geminiService';
import { HeartIcon, SunIcon, MoonIcon, UserGroupIcon, CubeTransparentIcon, BookOpenIcon } from './components/icons/Icons';
import ChibiSprite from './components/ChibiSprite';

// =================================================================
// Codex Panel Component
// =================================================================
interface CodexPanelProps {
  onClose: () => void;
}

const CodexPanel: React.FC<CodexPanelProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<CodexEntity | null>(codexData.find(e => e.type === 'character') || codexData[0]);

  const categories = useMemo(() => {
    const cats = codexData.map(e => e.type);
    return [...new Set(cats)];
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const filteredEntities = useMemo(() => {
    if (!selectedCategory) return [];
    return codexData.filter(e => e.type === selectedCategory);
  }, [selectedCategory]);
  
  const renderAttributes = (attributes: { [key: string]: any }) => {
     // Exclude 'visuals' object from being rendered as a plain attribute
    return Object.entries(attributes).filter(([key]) => key !== 'visuals').map(([key, value]) => (
        <div key={key} className="flex justify-between text-xs border-b border-slate-700 py-1">
            <span className="capitalize text-slate-400">{key.replace(/_/g, ' ')}</span>
            <span className="font-bold text-cyan-300">{Array.isArray(value) ? value.join('-') : value.toString()}</span>
        </div>
    ));
  };
  
  const renderEntityIcon = (entity: CodexEntity) => {
    const isCharacter = entity.type === CodexEntityType.CHARACTER || entity.type === CodexEntityType.NPC;
    const visualAttrs = entity.attributes?.visuals;

    if (isCharacter && visualAttrs) {
      return <ChibiSprite
        base={visualAttrs.base}
        hair={visualAttrs.hair}
        outfit={visualAttrs.outfit}
        weapon={visualAttrs.weapon}
        className="w-full h-full"
      />
    }
    return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: entity.svg_code }}></div>;
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-slate-900/80 backdrop-blur-md border border-cyan-400/30 rounded-lg shadow-xl shadow-cyan-500/10 w-full max-w-4xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-3 text-slate-400 hover:text-cyan-300 transition-colors z-10 text-2xl">&times;</button>
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-slate-900/50 p-4 border-b md:border-b-0 md:border-r border-slate-700/50 overflow-y-auto">
            <h2 className="text-lg font-bold text-cyan-300 tracking-widest uppercase mb-4">Codex</h2>
            <ul>
                {categories.map(cat => (
                    <li key={cat}>
                        <button 
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left p-2 rounded-md capitalize transition-colors ${selectedCategory === cat ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-700/50'}`}
                        >
                            {cat}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        {/* Grid View */}
        <div className="w-full md:w-1/2 p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredEntities.map(entity => (
                <div key={entity.id} onClick={() => setSelectedEntity(entity)} className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${selectedEntity?.id === entity.id ? 'bg-slate-600 border-cyan-400' : 'bg-slate-800 border-slate-700 hover:border-cyan-500 hover:bg-slate-700'}`}>
                    <div className="aspect-square flex items-center justify-center">
                       {renderEntityIcon(entity)}
                    </div>
                    <p className="text-xs text-center mt-2 truncate">{entity.name}</p>
                </div>
            ))}
        </div>

        {/* Detail View */}
        <div className="w-full md:w-1/3 bg-slate-900/30 p-4 border-t md:border-t-0 md:border-l border-slate-700/50 overflow-y-auto">
            {selectedEntity ? (
                <div>
                    <div className="w-full h-40 bg-slate-800/50 rounded-lg flex items-center justify-center p-4 mb-4">
                      {renderEntityIcon(selectedEntity)}
                    </div>
                    <h3 className="text-lg font-bold text-cyan-300">{selectedEntity.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 capitalize">{selectedEntity.type} - {selectedEntity.category}</p>
                    <p className="text-sm text-slate-300 mb-4">{selectedEntity.description}</p>
                    {selectedEntity.attributes && (
                        <div>
                            <h4 className="font-bold text-slate-200 mb-2">Attributes</h4>
                            <div className="space-y-1">
                                {renderAttributes(selectedEntity.attributes)}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                 <div className="flex items-center justify-center h-full text-slate-500">Select an item to view details</div>
            )}
        </div>
      </div>
    </div>
  );
};

// =================================================================
// World Generation
// =================================================================
const spawnEntity = (codexId: string, occupied: Set<string>): Entity | null => {
    const codexEntry = codexData.find(e => e.id === codexId);
    if (!codexEntry || codexEntry.type === CodexEntityType.ITEM || codexEntry.type === CodexEntityType.BLUEPRINT) return null;

    let x, y;
    let attempts = 0;
    do {
        x = Math.floor(Math.random() * GRID_WIDTH);
        y = Math.floor(Math.random() * GRID_HEIGHT);
        if (attempts++ > 200) return null; // Avoid infinite loop on a full grid
    } while (occupied.has(`${x},${y}`));
    occupied.add(`${x},${y}`);

    const baseEntity: BaseEntity = {
        id: `${codexId}-${Math.random().toString(36).substr(2, 9)}`,
        codexId: codexId,
        x,
        y,
        hp: codexEntry.attributes?.hp,
        maxHp: codexEntry.attributes?.hp,
        type: codexEntry.type,
    };

    if (codexEntry.type === CodexEntityType.CHARACTER || codexEntry.type === CodexEntityType.NPC) {
        return {
            ...baseEntity,
            type: codexEntry.type,
            action: 'Idle',
            name: codexEntry.name,
        } as Character | NPC;
    }
    
    return baseEntity as Entity;
};

const initializeWorld = (): Entity[] => {
    const entities: Entity[] = [];
    const occupied = new Set<string>();

    const biomeSpawns = spawnEntitiesForBiome('urban_ruins', Date.now());

    for (const spawnRule of biomeSpawns) {
        const potentialEntries = getEntitiesByCategory(spawnRule.category);
        if (potentialEntries.length === 0) continue;

        for (let i = 0; i < spawnRule.count; i++) {
            const randomEntry = potentialEntries[Math.floor(Math.random() * potentialEntries.length)];
            const entity = spawnEntity(randomEntry.id, occupied);
            if (entity) entities.push(entity);
        }
    }
    
    const survivorEntries = getEntitiesByCategory('player');
    if (survivorEntries.length > 0) {
         for (let i = 0; i < INITIAL_SURVIVORS; i++) {
            const randomEntry = survivorEntries[Math.floor(Math.random() * survivorEntries.length)];
            const entity = spawnEntity(randomEntry.id, occupied);
            if (entity) entities.push(entity);
        }
    }

    return entities;
};

// =================================================================
// App Component
// =================================================================
const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      day: 1,
      time: 'Day',
      ticks: 0,
      entities: initializeWorld(),
      event: null,
      eventLog: []
    };
  });

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [view, setView] = useState({ zoom: 0.8, pan: { x: 0, y: 0 } });
  
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    didMove: false,
  });

  const updateGame = useCallback(() => {
    if (isPaused) return;

    setGameState(prev => {
      const survivors = prev.entities.filter(e => {
        if (e.type !== CodexEntityType.CHARACTER) return false;
        const ce = codexData.find(c => c.id === e.codexId);
        return ce?.category === 'player';
      });

      const processedEntities: Entity[] = [];
      const occupiedInNextFrame = new Set<string>();

      prev.entities.forEach(e => {
        if (e.type !== CodexEntityType.CHARACTER && e.type !== CodexEntityType.NPC) {
          processedEntities.push(e);
          occupiedInNextFrame.add(`${e.x},${e.y}`);
        }
      });
      
      prev.entities.forEach(entity => {
        if (entity.type !== CodexEntityType.CHARACTER && entity.type !== CodexEntityType.NPC) return;

        const char = entity as Character | NPC;
        const newCharState = { ...char };
        const codexEntry = codexData.find(c => c.id === char.codexId);

        let finalX = char.x;
        let finalY = char.y;

        if (codexEntry && Math.random() > 0.5) {
          let targetX: number | null = null;
          let targetY: number | null = null;
          
          if (codexEntry.category.includes('enemy') || codexEntry.category.includes('hostile') || codexEntry.category.includes('creature')) {
            let closestSurvivor: Entity | null = null;
            let minDistance = 8; 

            survivors.forEach(survivor => {
              const distance = Math.hypot(survivor.x - char.x, survivor.y - char.y);
              if (distance < minDistance) {
                minDistance = distance;
                closestSurvivor = survivor;
              }
            });

            if (closestSurvivor) {
              targetX = closestSurvivor.x;
              targetY = closestSurvivor.y;
              newCharState.action = 'Hunting';
            } else {
              newCharState.action = 'Wandering';
              if (Math.random() < 0.2) {
                targetX = char.x + Math.floor(Math.random() * 3) - 1;
                targetY = char.y + Math.floor(Math.random() * 3) - 1;
              }
            }
          } 
          else if (codexEntry.category === 'player') {
            newCharState.action = 'Exploring';
            if (Math.random() < 0.1) { 
              targetX = char.x + Math.floor(Math.random() * 3) - 1;
              targetY = char.y + Math.floor(Math.random() * 3) - 1;
            }
          }

          if (targetX !== null && targetY !== null && (targetX !== char.x || targetY !== char.y)) {
            const moveX = Math.sign(targetX - char.x);
            const moveY = Math.sign(targetY - char.y);
            const potentialX = Math.max(0, Math.min(GRID_WIDTH - 1, char.x + moveX));
            const potentialY = Math.max(0, Math.min(GRID_HEIGHT - 1, char.y + moveY));
            if (!occupiedInNextFrame.has(`${potentialX},${potentialY}`)) {
              finalX = potentialX;
              finalY = potentialY;
            }
          }
        }
        
        newCharState.x = finalX;
        newCharState.y = finalY;
        processedEntities.push(newCharState);
        occupiedInNextFrame.add(`${finalX},${finalY}`);
      });

      const newTicks = prev.ticks + 1;
      const newTime = newTicks % 100 < 50 ? 'Day' : 'Night';
      const newDay = Math.floor(newTicks / 100) + 1;

      if (newTicks % 150 === 0 && !isLoadingEvent) {
          setIsLoadingEvent(true);
          const currentSurvivors = processedEntities.filter(e => codexData.find(c => c.id === e.codexId)?.category === 'player').length;
          const currentHostiles = processedEntities.filter(e => codexData.find(c => c.id === e.codexId)?.category.includes('enemy') || codexData.find(c => c.id === e.codexId)?.category.includes('creature')).length;

          generateGameEvent(newDay, currentSurvivors, currentHostiles, prev.eventLog.slice(-3)).then(eventText => {
            const newEvent = { id: Date.now(), text: eventText };
            setGameState(gs => ({ ...gs, event: newEvent, eventLog: [newEvent.text, ...gs.eventLog].slice(0, 10) }));
            setIsLoadingEvent(false);
          }).catch(err => {
            console.error("Failed to generate event:", err);
            setIsLoadingEvent(false);
          });
      }

      return { ...prev, entities: processedEntities, ticks: newTicks, time: newTime, day: newDay };
    });
  }, [isPaused, isLoadingEvent]);


  useEffect(() => {
    const gameLoop = setInterval(updateGame, TICK_RATE);
    return () => clearInterval(gameLoop);
  }, [updateGame]);
  
  const handleEntityClick = (entity: Entity) => {
    setSelectedEntity(entity);
  };
  
  const handleCloseModal = () => {
    setSelectedEntity(null);
  };
  
  const handleCloseEventModal = () => {
    setGameState(prev => ({ ...prev, event: null }));
  };

  const { survivorsCount, hostilesCount } = useMemo(() => {
    let sCount = 0;
    let hCount = 0;
    for (const entity of gameState.entities) {
        if (entity.type === CodexEntityType.CHARACTER || entity.type === CodexEntityType.NPC) {
            const codexEntry = codexData.find(c => c.id === entity.codexId);
            if (codexEntry) {
                if (codexEntry.category === 'player') sCount++;
                else if (codexEntry.category.includes('enemy') || codexEntry.category.includes('creature')) hCount++;
            }
        }
    }
    return { survivorsCount: sCount, hostilesCount: hCount };
  }, [gameState.entities]);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setView(v => {
        const zoomFactor = direction === 'in' ? 1.2 : 1 / 1.2;
        const newZoom = Math.max(0.3, Math.min(2.0, v.zoom * zoomFactor));
        return { ...v, zoom: newZoom };
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
      e.preventDefault();
      dragRef.current = { isDragging: true, startX: e.clientX, startY: e.clientY, didMove: false };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      e.preventDefault();

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (!dragRef.current.didMove && Math.hypot(dx, dy) > 5) {
          dragRef.current.didMove = true;
      }
      
      if (dragRef.current.didMove) {
          setView(v => ({ ...v, pan: { x: v.pan.x + dx, y: v.pan.y + dy } }));
          dragRef.current.startX = e.clientX;
          dragRef.current.startY = e.clientY;
      }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
      dragRef.current.isDragging = false;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
      handleZoom(e.deltaY < 0 ? 'in' : 'out');
  }, [handleZoom]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 font-mono pixelated">
      {/* Game Header UI */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-cyan-300 tracking-widest uppercase">Project: Manusha</h1>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
                {gameState.time === 'Day' ? <SunIcon className="w-5 h-5 text-yellow-300"/> : <MoonIcon className="w-5 h-5 text-indigo-300"/>}
                <span>Day {gameState.day}</span>
            </div>
            <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5 text-green-400"/>
                <span>{survivorsCount}</span>
            </div>
            <div className="flex items-center space-x-2">
                <CubeTransparentIcon className="w-5 h-5 text-red-400"/>
                <span>{hostilesCount}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <div className="flex items-center rounded-md bg-slate-700/50 border border-slate-600">
                <button onClick={() => handleZoom('out')} className="px-3 py-2 text-lg font-bold leading-none hover:bg-slate-600/50 rounded-l-md transition-colors" aria-label="Zoom out">-</button>
                <div className="w-px self-stretch bg-slate-600"></div>
                <button onClick={() => handleZoom('in')} className="px-3 py-2 text-lg font-bold leading-none hover:bg-slate-600/50 rounded-r-md transition-colors" aria-label="Zoom in">+</button>
            </div>
            <button
              onClick={() => setIsCodexOpen(true)}
              className="p-2 text-sm bg-slate-700/50 border border-slate-600 hover:bg-cyan-500 hover:text-slate-900 transition-colors rounded-md"
              aria-label="Open Codex"
            >
              <BookOpenIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className="px-4 py-2 text-sm bg-slate-700/50 border border-slate-600 hover:bg-cyan-500 hover:text-slate-900 transition-colors rounded-md w-24"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </div>
      
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <IsometricGrid 
          entities={gameState.entities} 
          onEntityClick={(entity) => {
              if (!dragRef.current.didMove) {
                  handleEntityClick(entity);
              }
          }}
          view={view} 
        />
      </div>

      {selectedEntity && <InfoPanel entity={selectedEntity} onClose={handleCloseModal} />}
      {gameState.event && <EventModal event={gameState.event} onClose={handleCloseEventModal} isLoading={isLoadingEvent} />}
      {isCodexOpen && <CodexPanel onClose={() => setIsCodexOpen(false)} />}
    </div>
  );
};

export default App;