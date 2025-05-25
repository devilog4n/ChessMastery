
"use client";

import type { Square as SquareType } from '@/types/chess';
import PieceIcon from './PieceIcon';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface SquareProps {
  squareData: SquareType;
  isSelected: boolean;
  isPossibleMove?: boolean;
  onClick: () => void;
}

export default function Square({ squareData, isSelected, isPossibleMove, onClick }: SquareProps) {
  const { row, col, piece } = squareData;
  const isLightSquare = (row + col) % 2 === 0;

  const [iconSize, setIconSize] = useState(60); // Default size, will be updated client-side

  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setIconSize(36);
        } else if (window.innerWidth < 1024) {
          setIconSize(48);
        } else {
          setIconSize(60);
        }
      }
    };

    updateSize(); // Set initial size on client
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);


  return (
    <div
      className={cn(
        "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center cursor-pointer transition-colors duration-150 ease-in-out p-0.5",
        isLightSquare ? 'bg-[#EADCC6] hover:bg-[#DCCAB4]' : 'bg-[#AF8F6D] hover:bg-[#A0805E]',
        isSelected && 'ring-4 ring-accent ring-inset shadow-inner',
        isPossibleMove && 'bg-accent/30 hover:bg-accent/50',
      )}
      onClick={onClick}
      role="button"
      aria-label={`Square ${String.fromCharCode(97 + col)}${8 - row}${piece ? `, contains ${piece.color} ${piece.type}` : ''}`}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      {piece && (
        <PieceIcon
          piece={piece}
          size={iconSize}
        />
      )}
    </div>
  );
}
