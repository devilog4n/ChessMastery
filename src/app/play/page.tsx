
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Chessboard from '@/components/chess/Chessboard';
import MoveHistory from '@/components/game/MoveHistory';
import AiTutorPanel from '@/components/game/AiTutorPanel';
import GameControls from '@/components/game/GameControls';
import { useChessGame } from '@/hooks/useChessGame';
import type { Difficulty, GameMode } from '@/types/chess';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle2, Info, Crown } from 'lucide-react';
import Loading from '../loading';

function PlayPageContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') as GameMode) || 'pvp'; // Default to pvp if no mode
  const difficultyParam = (searchParams.get('difficulty') as Difficulty | undefined);

  const {
    gameState,
    handleSquareClick,
    resetGame,
    saveGame,
    loadGame,
    getAiSuggestions,
    toggleAiTutor,
  } = useChessGame(mode, difficultyParam);

  const { boardState, selectedSquare, moveHistory, currentPlayer, isGameOver, winner, aiSuggestions, isAiTutorEnabled, gameMode, difficulty } = gameState;

  const isPlayerTurnForTutor = gameMode === 'pvp' || (gameMode === 'pve' && currentPlayer === 'white');

  const playerDisplayName = (player: 'white' | 'black') => player === 'white' ? 'Brancas' : 'Pretas';
  const difficultyDisplayName = (level?: Difficulty) => {
    if (!level) return 'N/A';
    if (level === 'easy') return 'Fácil';
    if (level === 'medium') return 'Médio';
    if (level === 'hard') return 'Difícil';
    return 'N/A';
  }

  let statusMessage = `Jogador Atual: ${playerDisplayName(currentPlayer)}`;
  let StatusIcon = Info;
  let statusColor = 'text-blue-600';

  if (isGameOver) {
    if (winner && winner !== 'draw') {
      statusMessage = `${playerDisplayName(winner)} vencem!`;
      StatusIcon = Crown;
      statusColor = 'text-yellow-500';
    } else {
      statusMessage = "É um empate!";
      StatusIcon = CheckCircle2;
      statusColor = 'text-green-600';
    }
  } else if (selectedSquare) {
    statusMessage = `${playerDisplayName(currentPlayer)} jogam. Peça selecionada em ${String.fromCharCode(97 + selectedSquare.col)}${8 - selectedSquare.row}.`;
    StatusIcon = AlertTriangle;
    statusColor = 'text-orange-500';
  }


  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary">Maestria do Xadrez</h1>
        <p className="text-muted-foreground">
          Modo: {gameMode === 'pve' ? `Jogador vs IA (${difficultyDisplayName(difficulty)})` : 'Jogador vs Jogador'}
        </p>
      </header>

      <div className="w-full max-w-6xl">
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <div className={`flex items-center justify-center p-3 rounded-md bg-secondary/50 ${statusColor}`}>
              <StatusIcon className="mr-2 h-6 w-6" />
              <span className="font-semibold text-lg">{statusMessage}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel: Move History & AI Tutor */}
          <div className="lg:w-1/3 space-y-6">
            <MoveHistory moves={moveHistory} />
            <AiTutorPanel
              isEnabled={isAiTutorEnabled}
              onToggle={toggleAiTutor}
              suggestions={aiSuggestions}
              onGetSuggestions={getAiSuggestions}
              isPlayerTurn={isPlayerTurnForTutor && !isGameOver}
            />
          </div>

          {/* Center Panel: Chessboard */}
          <div className="lg:w-2/3 flex justify-center items-start">
            <Chessboard
              boardState={boardState}
              selectedSquare={selectedSquare}
              onSquareClick={handleSquareClick}
            />
          </div>
        </div>

        <Separator className="my-8" />

        <GameControls
          onSave={saveGame}
          onLoad={loadGame}
          onReset={resetGame}
        />
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Maestria do Xadrez. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}


export default function PlayPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PlayPageContent />
    </Suspense>
  );
}
