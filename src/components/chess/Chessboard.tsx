
"use client";

import type { BoardState, Square as SquareType } from '@/types/chess';
import Square from './Square';

interface ChessboardProps {
  boardState: BoardState;
  selectedSquare: { row: number; col: number } | null;
  onSquareClick: (row: number, col: number) => void;
  // possibleMoves?: { row: number; col: number }[]; // Optional: for highlighting
}

export default function Chessboard({ boardState, selectedSquare, onSquareClick }: ChessboardProps) {
  return (
    <div className="grid grid-cols-8 border-4 border-[#704214] shadow-2xl rounded overflow-hidden aspect-square max-w-full mx-auto bg-card">
      {boardState.map((rowSquares, rowIndex) =>
        rowSquares.map((squareData, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            squareData={squareData}
            isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
            // isPossibleMove={possibleMoves?.some(m => m.row === rowIndex && m.col === colIndex)}
            onClick={() => onSquareClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
