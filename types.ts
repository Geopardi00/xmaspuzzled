export enum Stage {
  INTRO = 'INTRO',
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  LEVEL_3 = 'LEVEL_3',
  FINISHED = 'FINISHED'
}

export interface PuzzleInputConfig {
  id: string;
  expected: string | string[]; // Can be multiple acceptable answers
  placeholder?: string;
  label?: string; // For things like "VS."
  type?: 'text' | 'number';
}

export interface PuzzleConfig {
  id: string;
  imageSrc: string;
  inputs: PuzzleInputConfig[];
  hint?: string;
  layout?: 'single' | 'split';
}

export interface LevelConfig {
  id: Stage;
  title: string;
  puzzles: PuzzleConfig[];
}

export interface GameState {
  stage: Stage;
  hintUsed: boolean; // Global hint usage
  completedPuzzles: string[]; // IDs of puzzles solved
  imageOverrides: Record<string, string>; // Map of image path -> uploaded blob URL
}