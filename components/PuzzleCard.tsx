import React, { useState } from 'react';
import { HelpCircle, Lock, Unlock } from 'lucide-react';
import { PuzzleConfig } from '../types';
import ImageWithFallback from './ImageWithFallback';

interface PuzzleCardProps {
  puzzle: PuzzleConfig;
  onSolve: (id: string) => void;
  isSolved: boolean;
  globalHintUsed: boolean;
  onUseHint: () => void;
  onImageUpdate: (originalSrc: string, newSrc: string) => void;
  imageOverride?: string;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({ 
  puzzle, 
  onSolve, 
  isSolved, 
  globalHintUsed, 
  onUseHint,
  onImageUpdate,
  imageOverride
}) => {
  // Local state for inputs
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [localHintRevealed, setLocalHintRevealed] = useState(false);

  const handleInputChange = (inputId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [inputId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) return;

    let allCorrect = true;

    puzzle.inputs.forEach(input => {
      const val = (inputValues[input.id] || '').trim().toLowerCase();
      const expected = Array.isArray(input.expected) 
        ? input.expected.map(v => v.toLowerCase()) 
        : [input.expected.toLowerCase()];
      
      if (!expected.includes(val)) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      onSolve(puzzle.id);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const showHintButton = puzzle.hint && !isSolved && !localHintRevealed;
  const hintDisabled = globalHintUsed && !localHintRevealed;

  const revealHint = () => {
    if (!globalHintUsed) {
      setLocalHintRevealed(true);
      onUseHint();
    }
  };

  return (
    <div className={`relative bg-slate-900/80 border border-slate-700 rounded-lg p-4 shadow-2xl backdrop-blur-sm transition-all duration-500 ${isSolved ? 'border-green-800/50 shadow-green-900/20' : ''}`}>
      {/* Header / Status */}
      <div className="absolute -top-3 -right-3">
        {isSolved ? (
          <div className="bg-green-900 text-green-100 p-2 rounded-full shadow-lg border border-green-700">
            <Unlock size={20} />
          </div>
        ) : (
          <div className="bg-red-950 text-red-500 p-2 rounded-full shadow-lg border border-red-900">
            <Lock size={20} />
          </div>
        )}
      </div>

      {/* Image Area */}
      <div className="mb-4 rounded-md overflow-hidden border border-slate-800 bg-black h-64 relative">
        <ImageWithFallback
          src={puzzle.imageSrc}
          alt={`Puzzle ${puzzle.id}`}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
          onImageUpdate={onImageUpdate}
          overriddenSrc={imageOverride}
        />
      </div>

      {/* Inputs Area */}
      <form onSubmit={handleSubmit} className={`space-y-4 ${shake ? 'animate-shake' : ''}`}>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {puzzle.inputs.map((input, idx) => (
            <React.Fragment key={input.id}>
              <div className="relative">
                <input
                  type={input.type || "text"}
                  disabled={isSolved}
                  value={inputValues[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  placeholder={input.placeholder || "???"}
                  className={`
                    w-32 bg-slate-950 border-b-2 text-center py-2 font-mono text-lg tracking-widest outline-none transition-colors
                    ${isSolved 
                      ? 'border-green-800 text-green-400' 
                      : 'border-slate-600 text-slate-100 focus:border-red-600 focus:bg-slate-900'
                    }
                  `}
                />
              </div>
              {/* Separator Label (like VS.) */}
              {idx < puzzle.inputs.length - 1 && puzzle.inputs[idx+1].label && ( // Logic assumes label belongs to the "gap"
                 <span className="font-cinzel font-bold text-red-600 text-xl mx-2">VS.</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {!isSolved && (
          <button 
            type="submit" 
            className="w-full mt-2 bg-red-950 hover:bg-red-900 text-red-100 font-cinzel text-sm py-2 px-4 rounded border border-red-900/50 transition-colors uppercase tracking-widest"
          >
            Submit
          </button>
        )}
      </form>

      {/* Hint Area */}
      <div className="mt-4 min-h-[40px] flex justify-center">
        {localHintRevealed ? (
          <div className="text-yellow-500 font-mono text-sm animate-fade-in text-center border-t border-slate-800 pt-2 w-full">
            <span className="text-slate-500 mr-2">[HINT]</span> 
            {puzzle.hint}
          </div>
        ) : (
          showHintButton && (
            <button
              onClick={revealHint}
              disabled={hintDisabled}
              className={`flex items-center gap-2 text-xs font-mono py-1 px-3 rounded-full transition-all border
                ${hintDisabled 
                  ? 'text-slate-600 border-slate-800 cursor-not-allowed opacity-50' 
                  : 'text-slate-400 border-slate-700 hover:text-yellow-400 hover:border-yellow-900/50 hover:bg-yellow-900/10'
                }
              `}
            >
              <HelpCircle size={14} />
              {hintDisabled ? "Hint Unavailable" : "Use Global Hint"}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PuzzleCard;