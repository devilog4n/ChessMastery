export type PlayerColor = 'white' | 'black';

export type PieceSymbol = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  symbol: PieceSymbol;
}

export interface Square {
  row: number;
  col: number;
  piece: Piece | null;
}

export type BoardState = Square[][];

export interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: Piece;
  notation: string; // e.g., "e2-e4" or "Nf3"
}

export type GameMode = 'pvp' | 'pve';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  boardState: BoardState;
  currentPlayer: PlayerColor;
  moveHistory: Move[];
  gameMode: GameMode;
  difficulty?: Difficulty;
  selectedSquare: { row: number; col: number } | null;
  isGameOver: boolean;
  winner: PlayerColor | 'draw' | null;
  aiSuggestions: AiSuggestion | null;
  isAiTutorEnabled: boolean;
}

export interface AiSuggestion {
  suggestedMove: string;
  reasoning: string;
  alternativeMoves?: string[];
}
