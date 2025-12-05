import React, { useState, useEffect } from 'react';
import SnowBackground from './components/SnowBackground';
import PuzzleCard from './components/PuzzleCard';
import { Stage, LevelConfig, GameState } from './types';
import { IMAGES } from './assets';
import { Lock, Unlock, Film } from 'lucide-react';

const LEVELS: LevelConfig[] = [
  {
    id: Stage.LEVEL_1,
    title: "The Breakfast",
    puzzles: [
      {
        id: "L1",
        imageSrc: IMAGES.LEVEL_1,
        hint: "Janne Ahonen",
        layout: "single",
        inputs: [{ id: "l1_input", expected: "Mäkikotka" }]
      }
    ]
  },
  {
    id: Stage.LEVEL_2,
    title: "Double Feature",
    puzzles: [
      {
        id: "L2A",
        imageSrc: IMAGES.LEVEL_2_A,
        hint: "irma magna",
        layout: "split",
        inputs: [{ id: "l2a_input", expected: "Pirunpelto" }]
      },
      {
        id: "L2B",
        imageSrc: IMAGES.LEVEL_2_B,
        layout: "split",
        // No hint configured for this specific puzzle
        inputs: [{ id: "l2b_input", expected: "Pallo" }]
      }
    ]
  },
  {
    id: Stage.LEVEL_3,
    title: "The Final Showdown",
    puzzles: [
      {
        id: "L3A",
        imageSrc: IMAGES.LEVEL_3_A,
        hint: "Adrian!!!",
        layout: "split",
        inputs: [
          { id: "l3a_1", expected: "Rocky" },
          { id: "l3a_2", expected: "Apollo", label: "VS." } // The "VS." is handled in rendering logic or label prop
        ]
      },
      {
        id: "L3B",
        imageSrc: IMAGES.LEVEL_3_B,
        layout: "split",
        inputs: [{ id: "l3b_input", expected: ["13", "thirteen"] }]
      }
    ]
  }
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    stage: Stage.INTRO,
    hintUsed: false,
    completedPuzzles: [],
    imageOverrides: {}
  });

  const [fadeKey, setFadeKey] = useState(0); // To trigger animations on stage change

  useEffect(() => {
    setFadeKey(prev => prev + 1);
  }, [gameState.stage]);

  const handleStart = () => {
    setGameState(prev => ({ ...prev, stage: Stage.LEVEL_1 }));
  };

  const handleSolve = (puzzleId: string) => {
    setGameState(prev => {
      const newCompleted = [...prev.completedPuzzles, puzzleId];
      
      // Check if current level is complete
      const currentLevelConfig = LEVELS.find(l => l.id === prev.stage);
      if (!currentLevelConfig) return prev;

      const levelPuzzleIds = currentLevelConfig.puzzles.map(p => p.id);
      const isLevelComplete = levelPuzzleIds.every(id => newCompleted.includes(id));

      if (isLevelComplete) {
        // Delay slightly for visual satisfaction
        setTimeout(() => {
          advanceStage(prev.stage);
        }, 1500);
      }

      return { ...prev, completedPuzzles: newCompleted };
    });
  };

  const advanceStage = (currentStage: Stage) => {
    let nextStage = Stage.FINISHED;
    if (currentStage === Stage.LEVEL_1) nextStage = Stage.LEVEL_2;
    if (currentStage === Stage.LEVEL_2) nextStage = Stage.LEVEL_3;
    if (currentStage === Stage.LEVEL_3) nextStage = Stage.FINISHED;

    setGameState(prev => ({ ...prev, stage: nextStage }));
  };

  const handleUseHint = () => {
    setGameState(prev => ({ ...prev, hintUsed: true }));
  };

  const handleImageUpdate = (originalSrc: string, newSrc: string) => {
    setGameState(prev => ({
      ...prev,
      imageOverrides: {
        ...prev.imageOverrides,
        [originalSrc]: newSrc
      }
    }));
  };

  const resetGame = () => {
    setGameState({
      stage: Stage.INTRO,
      hintUsed: false,
      completedPuzzles: [],
      imageOverrides: gameState.imageOverrides // Keep uploads for convenience
    });
  };

  // Render Logic
  const renderContent = () => {
    if (gameState.stage === Stage.INTRO) {
      return (
        <div className="max-w-2xl mx-auto text-center px-6 animate-fade-in">
          <h1 className="font-cinzel text-5xl md:text-7xl text-red-600 mb-8 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] tracking-tighter">
            X-MAS MOVIE<br/>APOCALYPSE
          </h1>
          <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-lg backdrop-blur-md shadow-2xl">
            <p className="font-mono text-slate-300 text-lg leading-relaxed mb-8">
              "Auta Joulupukkia selvittämään Joulumuorin lempielokuva. Tontut ovat jättäneet kryptisiä vihjeitä ja pukilta alkaa loppua aika ennen jouluaattoa."
            </p>
            <button 
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center px-8 py-3 font-cinzel font-bold text-white transition-all duration-200 bg-red-900 font-lg rounded-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-3">
                BEGIN MISSION <Lock size={18} className="group-hover:hidden"/> <Unlock size={18} className="hidden group-hover:block"/>
              </span>
            </button>
          </div>
        </div>
      );
    }

    if (gameState.stage === Stage.FINISHED) {
      return (
        <div className="max-w-3xl mx-auto text-center px-6 animate-fade-in">
          <div className="bg-black/90 border-2 border-red-900 p-12 rounded-lg shadow-[0_0_50px_rgba(153,27,27,0.3)]">
            <h2 className="font-mono text-red-500 text-sm tracking-[0.5em] mb-4">CLASSIFIED FILE DECRYPTED</h2>
            <h1 className="font-cinzel text-6xl md:text-8xl text-slate-100 mb-8 tracking-widest">
              APOLLO 13
            </h1>
            <p className="font-mono text-green-500 mb-12 flex items-center justify-center gap-2">
              <Film /> MRS. CLAUS'S FAVORITE MOVIE
            </p>
            <button 
              onClick={resetGame}
              className="text-slate-500 hover:text-white font-mono text-sm underline underline-offset-4 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      );
    }

    // Level Rendering
    const currentLevel = LEVELS.find(l => l.id === gameState.stage);
    if (!currentLevel) return null;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 pb-12 animate-fade-in">
        <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
             <h2 className="font-cinzel text-3xl text-red-600">{currentLevel.title}</h2>
             <div className="text-slate-500 font-mono text-xs mt-1">
               Decryption Phase: {gameState.stage.replace('LEVEL_', '')} / 3
             </div>
          </div>
          <div className="flex gap-2">
            {[Stage.LEVEL_1, Stage.LEVEL_2, Stage.LEVEL_3].map((s, i) => (
              <div 
                key={s} 
                className={`h-2 w-8 rounded-full ${
                  gameState.stage === s ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 
                  Object.values(Stage).indexOf(gameState.stage) > Object.values(Stage).indexOf(s) ? 'bg-green-900' : 'bg-slate-800'
                }`} 
              />
            ))}
          </div>
        </header>
        
        <div className={`grid gap-8 ${currentLevel.puzzles.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
          {currentLevel.puzzles.map(puzzle => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              onSolve={handleSolve}
              isSolved={gameState.completedPuzzles.includes(puzzle.id)}
              globalHintUsed={gameState.hintUsed}
              onUseHint={handleUseHint}
              onImageUpdate={handleImageUpdate}
              imageOverride={gameState.imageOverrides[puzzle.imageSrc]}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div key={fadeKey} className="min-h-screen relative flex items-center justify-center py-12">
      <SnowBackground />
      <div className="relative z-10 w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;