
import React from 'react';
import { GameEvent } from '../types';

interface EventModalProps {
  event: GameEvent;
  isLoading: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isLoading, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-30 max-w-md w-full" onClick={onClose}>
        <div className="bg-slate-800/70 backdrop-blur-lg border border-rose-500/40 rounded-lg shadow-2xl shadow-rose-500/20 overflow-hidden transform transition-all animate-fade-in-up">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-rose-300 uppercase tracking-widest">[ World Event ]</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-rose-300 transition-colors leading-none text-2xl">&times;</button>
                </div>
                <div className="mt-2 text-slate-200">
                  {isLoading ? "A strange feeling hangs in the air..." : event.text}
                </div>
            </div>
            <div className="h-1 bg-rose-500/50 animate-pulse"></div>
        </div>
    </div>
  );
};

export default EventModal;
