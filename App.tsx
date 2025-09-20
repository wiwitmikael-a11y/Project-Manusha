
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Import `BaseEntity` type from `./types` to resolve the 'Cannot find name' error.
import { GameState, Entity, CodexEntity, CodexEntityType, BaseEntity, Character } from './types';
import { GRID_WIDTH, GRID_HEIGHT, TICK_RATE, codexData } from './constants';
import IsometricGrid from './components/IsometricGrid';
import InfoPanel from './components/InfoPanel';
import EventModal from './components/EventModal';
import { generateGameEvent } from './services/geminiService';
import { HeartIcon, SunIcon, MoonIcon, UserGroupIcon, CubeTransparentIcon, BookOpenIcon } from './components/icons/Icons';

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
    // Select the first category by default
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const filteredEntities = useMemo(() => {
    if (!selectedCategory) return [];
    return codexData.filter(e => e.type === selectedCategory);
  }, [selectedCategory]);
  
  const renderAttributes = (attributes: { [key: string]: any }) => {
    return Object.entries(attributes).map(([key, value]) => (
        <div key={key} className="flex justify-between text-xs border-b border-slate-700 py-1">
            <span className="capitalize text-slate-400">{key.replace(/_/g, ' ')}</span>
            <span className="font-bold text-cyan-300">{Array.isArray(value) ? value.join('-') : value.toString()}</span>
        </div>
    ));
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
                    <div className="aspect-square flex items-center justify-center" dangerouslySetInnerHTML={{ __html: entity.svg_code }}></div>
                    <p className="text-xs text-center mt-2 truncate">{entity.name}</p>
                </div>
            ))}
        </div>

        {/* Detail View */}
        <div className="w-full md:w-1/3 bg-slate-900/30 p-4 border-t md:border-t-0 md:border-l border-slate-700/50 overflow-y-auto">
            {selectedEntity ? (
                <div>
                    <div className="w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center p-4 mb-4" dangerouslySetInnerHTML={{ __html: selectedEntity.svg_code}}></div>
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
    if (!codexEntry || codexEntry.type === CodexEntityType.ITEM) return null;

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

    if (codexEntry.type === CodexEntityType.CHARACTER) {
        return {
            ...baseEntity,
            type: CodexEntityType.CHARACTER,
            action: 'Idle',
            name: codexEntry.name,
        };
    }
    
    return baseEntity as Entity;
};

const initializeWorld = (): Entity[] => {
    const entities: Entity[] = [];
    const occupied = new Set<string>();

    const spawn = (id: string) => {
        const entity = spawnEntity(id, occupied);
        if (entity) entities.push(entity);
    }
    
    // Spawn Player Characters
    for (let i = 0; i < 3; i++) spawn('player_01');

    // Spawn Hostile Characters
    for (let i = 0; i < 2; i++) spawn('char_raider_01');
    for (let i = 0; i < 3; i++) spawn('char_mutant_dog_01');
    spawn('creature_bloater_01');

    // Spawn Environment
    for (let i = 0; i < 8; i++) spawn('env_dead_tree_01');
    for (let i = 0; i < 5; i++) spawn('env_rock_01');
    for (let i = 0; i < 4; i++) spawn('env_scrap_metal_01');
    for (let i = 0; i < 2; i++) spawn('env_car_wreck_01');
    
    // Spawn Structures
    spawn('struct_workbench_01');
    spawn('struct_campfire_01');

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

  const updateGame = useCallback(() => {
    if (isPaused) return;

    setGameState(prev => {
      // --- AI and Movement Logic ---
      const survivors = prev.entities.filter(e => {
        if (e.type !== CodexEntityType.CHARACTER) return false;
        const ce = codexData.find(c => c.id === e.codexId);
        return ce?.category === 'player';
      });

      const processedEntities: Entity[] = [];
      const occupiedInNextFrame = new Set<string>();

      // First, place all static entities and reserve their spots
      prev.entities.forEach(e => {
        if (e.type !== CodexEntityType.CHARACTER) {
          processedEntities.push(e);
          occupiedInNextFrame.add(`${e.x},${e.y}`);
        }
      });
      
      // Now, process characters and determine their new positions
      prev.entities.forEach(entity => {
        if (entity.type !== CodexEntityType.CHARACTER) return;

        const char = entity as Character;
        const newCharState = { ...char };
        const codexEntry = codexData.find(c => c.id === char.codexId);

        let finalX = char.x;
        let finalY = char.y;

        // Only give a chance to move, not every tick
        if (codexEntry && Math.random() > 0.5) {
          let targetX: number | null = null;
          let targetY: number | null = null;
          
          // Hostile AI: hunt survivors or wander
          if (codexEntry.category.includes('enemy') || codexEntry.category.includes('hostile') || codexEntry.category.includes('creature')) {
            let closestSurvivor: Entity | null = null;
            let minDistance = 8; // Detection radius in grid units

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
              if (Math.random() < 0.2) { // Low chance to wander if no target
                targetX = char.x + Math.floor(Math.random() * 3) - 1;
                targetY = char.y + Math.floor(Math.random() * 3) - 1;
              }
            }
          } 
          // Survivor AI: just wander for now
          else if (codexEntry.category === 'player') {
            newCharState.action = 'Exploring';
            if (Math.random() < 0.1) { // Very low chance to just wander
              targetX = char.x + Math.floor(Math.random() * 3) - 1;
              targetY = char.y + Math.floor(Math.random() * 3) - 1;
            }
          }

          if (targetX !== null && targetY !== null && (targetX !== char.x || targetY !== char.y)) {
            // Calculate move direction (-1, 0, or 1)
            const moveX = Math.sign(targetX - char.x);
            const moveY = Math.sign(targetY - char.y);

            const potentialX = Math.max(0, Math.min(GRID_WIDTH - 1, char.x + moveX));
            const potentialY = Math.max(0, Math.min(GRID_HEIGHT - 1, char.y + moveY));
            
            // Check for collision with already placed entities for this frame
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

      // --- Game State Update ---
      const newTicks = prev.ticks + 1;
      const newTime = newTicks % 100 < 50 ? 'Day' : 'Night';
      const newDay = Math.floor(newTicks / 100) + 1;

      // Trigger Gemini event
      if (newTicks % 150 === 0 && !isLoadingEvent) {
          setIsLoadingEvent(true);
          const currentSurvivors = processedEntities.filter(e => e.codexId === 'player_01').length;
          const currentHostiles = processedEntities.filter(e => {
            const ce = codexData.find(c => c.id === e.codexId);
            return ce && (ce.category.includes('enemy') || ce.category.includes('hostile') || ce.category.includes('creature'));
          }).length;

          generateGameEvent(newDay, currentSurvivors, currentHostiles, prev.eventLog.slice(-3)).then(eventText => {
            const newEvent = { id: Date.now(), text: eventText };
            setGameState(gs => ({
              ...gs, 
              event: newEvent,
              eventLog: [newEvent.text, ...gs.eventLog].slice(0, 10)
            }));
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
        if (entity.type === CodexEntityType.CHARACTER) {
            const codexEntry = codexData.find(c => c.id === entity.codexId);
            if (codexEntry) {
                if (codexEntry.category === 'player') {
                    sCount++;
                } else if (codexEntry.category.includes('enemy') || codexEntry.category.includes('hostile') || codexEntry.category.includes('creature')) {
                    hCount++;
                }
            }
        }
    }
    return { survivorsCount: sCount, hostilesCount: hCount };
  }, [gameState.entities]);


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
      
      <IsometricGrid entities={gameState.entities} onEntityClick={handleEntityClick} />

      {selectedEntity && <InfoPanel entity={selectedEntity} onClose={handleCloseModal} />}
      
      {gameState.event && <EventModal event={gameState.event} onClose={handleCloseEventModal} isLoading={isLoadingEvent} />}

      {isCodexOpen && <CodexPanel onClose={() => setIsCodexOpen(false)} />}
    </div>
  );
};

export default App;