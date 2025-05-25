
"use client";

import type { Piece } from '@/types/chess';
// UNICODE_PIECES is not used if SVGs are complete for all pieces.
// import { UNICODE_PIECES } from '@/lib/chess-logic';

interface PieceIconProps {
  piece: Piece;
  size: number;
}

// More detailed Staunton-style SVG paths.
// ViewBox is 0 0 100 100. Pieces are designed to be fairly centered and fill the space.

const PIECE_SVG_PATHS: Record<Piece['type'], { path: string; viewBox?: string }> = {
  pawn: {
    path: "M 50 15 A 10 10 0 0 1 50 25 Q 50 30 45 38 L 42 60 Q 40 70 35 75 L 65 75 Q 60 70 58 60 L 55 38 Q 50 30 50 25 Z M 30 80 H 70 V 90 H 30 Z",
    viewBox: "10 5 80 90" // Adjusted viewBox for better centering/scaling
  },
  rook: {
    path: "M 25 10 H 35 V 20 H 45 V 10 H 55 V 20 H 65 V 10 H 75 V 25 H 25 Z M 30 25 H 70 V 75 H 30 Z M 20 75 H 80 V 85 H 20 Z",
    viewBox: "10 5 80 85"
  },
  knight: {
    // Classic Staunton Knight - cburnett style inspiration
    path: "M 50 15 C 40 15, 30 20, 25 30 C 20 40, 20 50, 25 58 L 22 80 H 35 L 40 65 C 40 60, 45 55, 50 55 C 55 55, 60 60, 60 65 L 65 80 H 78 L 75 58 C 80 50, 80 40, 75 30 C 70 20, 60 15, 50 15 Z M 50 20 C 57 20, 65 25, 68 33 C 65 35, 60 38, 55 42 L 50 50 L 45 42 C 40 38, 35 35, 32 33 C 35 25, 43 20, 50 20 Z",
    viewBox: "18 10 64 75" 
  },
  bishop: {
    path: "M 50 10 A 7 7 0 0 1 50 18 A 7 7 0 0 1 50 10 Z M 50 20 Q 45 22 40 30 L 35 35 C 30 45 30 55 35 65 L 40 75 H 60 L 65 65 C 70 55 70 45 65 35 L 60 30 Q 55 22 50 20 Z M 30 80 H 70 V 90 H 30 Z M 45 25 L 55 25 L 50 35 Z", // Added mitre cut detail
    viewBox: "15 5 70 90"
  },
  queen: {
    path: "M 50 10 L 40 25 L 45 25 L 35 35 L 40 35 L 30 45 L 50 40 L 70 45 L 60 35 L 65 35 L 55 25 L 60 25 Z M 25 50 Q 20 60 25 75 L 75 75 Q 80 60 75 50 Z M 20 80 H 80 V 90 H 20 Z", // Points on crown
    viewBox: "10 5 80 90"
  },
  king: {
    // King with a cross finial
    path: "M 48 5 H 52 V 15 H 60 V 20 H 52 V 25 H 48 V 20 H 40 V 15 H 48 Z M 30 30 C 25 40 25 50 30 60 L 35 75 H 65 L 70 60 C 75 50 75 40 70 30 Z M 25 80 H 75 V 90 H 25 Z",
    viewBox: "15 0 70 90"
  },
};


export default function PieceIcon({ piece, size }: PieceIconProps) {
  if (!piece) return null;

  const fillColor = piece.color === 'white' ? '#F0EAD6' : '#4A4A4A'; // Ivory for white, Dark Gray for black
  const strokeColor = piece.color === 'white' ? '#333333' : '#1A1A1A'; // Darker stroke for black pieces for better contrast

  const svgData = PIECE_SVG_PATHS[piece.type];
  
  if (svgData) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={svgData.viewBox || "0 0 100 100"} // Use specific viewBox or default
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm" 
      >
        <path
          d={svgData.path}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}
