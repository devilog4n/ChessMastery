
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { BoardState, PlayerColor, GameMode, Difficulty, Move, GameState, AiSuggestion, Piece, Square as ChessSquare } from '@/types/chess';
import { getInitialBoardState, boardToFEN, squareToNotation, isValidMove as isBasicMoveValid, checkGameOver } from '@/lib/chess-logic';
import { chessMoveSuggestions } from '@/ai/flows/chess-move-suggestions';
import { useToast } from "@/hooks/use-toast";

const initialGameState: Omit<GameState, 'gameMode' | 'difficulty'> = {
  boardState: getInitialBoardState(),
  currentPlayer: 'white',
  moveHistory: [],
  selectedSquare: null,
  isGameOver: false,
  winner: null,
  aiSuggestions: null,
  isAiTutorEnabled: false,
};

export function useChessGame(initialMode: GameMode, initialDifficulty?: Difficulty) {
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    gameMode: initialMode,
    difficulty: initialDifficulty,
  });
  const { toast } = useToast();

  const resetGame = useCallback(() => {
    setGameState({
      ...initialGameState,
      boardState: getInitialBoardState(),
      gameMode: initialMode,
      difficulty: initialDifficulty,
    });
  }, [initialMode, initialDifficulty]);

  useEffect(() => {
    const savedGame = localStorage.getItem('chessMasteryGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame) as GameState;
        if (parsedGame.gameMode === initialMode && (initialMode === 'pvp' || parsedGame.difficulty === initialDifficulty)) {
           setGameState(parsedGame);
        } else {
          resetGame(); 
        }
      } catch (error)
      {
        console.error("Falha ao carregar o jogo do localStorage", error);
        resetGame();
      }
    } else {
      resetGame();
    }
  }, [initialMode, initialDifficulty, resetGame]);

  const saveGame = useCallback(() => {
    localStorage.setItem('chessMasteryGame', JSON.stringify(gameState));
    toast({ title: "Jogo Salvo!", description: "Seu progresso foi salvo localmente." });
  }, [gameState, toast]);
  
  const loadGame = useCallback(() => {
    const savedGame = localStorage.getItem('chessMasteryGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame) as GameState;
        // Ensure loaded game matches current context if params are stricter
        if (parsedGame.gameMode === initialMode && (initialMode === 'pvp' || parsedGame.difficulty === initialDifficulty)) {
          setGameState(parsedGame);
          toast({ title: "Jogo Carregado!", description: "Seu jogo salvo foi carregado." });
        } else {
          toast({ title: "Incompatibilidade de Jogo", description: "O jogo salvo não corresponde ao modo/dificuldade atual. Iniciando novo jogo.", variant: "destructive" });
          resetGame();
        }
      } catch (error) {
        console.error("Falha ao carregar o jogo do localStorage", error);
        toast({ title: "Falha ao Carregar", description: "Não foi possível carregar o jogo salvo.", variant: "destructive" });
      }
    } else {
      toast({ title: "Nenhum Jogo Salvo", description: "Nenhum jogo salvo encontrado para carregar.", variant: "destructive" });
    }
  }, [toast, initialMode, initialDifficulty, resetGame]);

  const playerDisplayName = (player: PlayerColor | 'draw' | null) => {
    if (player === 'white') return 'Brancas';
    if (player === 'black') return 'Pretas';
    return '';
  }

  const makeMove = useCallback((from: ChessSquare, to: ChessSquare) => {
    if (gameState.isGameOver) return;

    const piece = from.piece;
    if (!piece) return;

    const newBoardState = gameState.boardState.map(row => row.map(sq => ({ ...sq, piece: sq.piece ? {...sq.piece} : null })));
    newBoardState[to.row][to.col].piece = piece;
    newBoardState[from.row][from.col].piece = null;

    const moveNotation = `${piece.symbol.toLowerCase() !== 'p' ? piece.symbol.toUpperCase() : ''}${squareToNotation(from.row, from.col)}-${squareToNotation(to.row, to.col)}`;
    
    const newMove: Move = {
      from: { row: from.row, col: from.col },
      to: { row: to.row, col: to.col },
      piece: piece,
      notation: moveNotation,
    };

    const { isGameOver: newIsGameOver, winner: newWinner } = checkGameOver(newBoardState);

    setGameState(prev => ({
      ...prev,
      boardState: newBoardState,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
      moveHistory: [...prev.moveHistory, newMove],
      selectedSquare: null,
      isGameOver: newIsGameOver,
      winner: newWinner,
      aiSuggestions: null, 
    }));

    if (newIsGameOver && newWinner && newWinner !== 'draw') {
      toast({ title: "Fim de Jogo!", description: `${playerDisplayName(newWinner)} vencem!` });
    } else if (newIsGameOver) {
      toast({ title: "Fim de Jogo!", description: "É um empate!" });
    }

  }, [gameState.isGameOver, gameState.boardState, toast]); // Removed gameState.currentPlayer as it's derived from prev

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameState.isGameOver) return;

    const clickedSquare = gameState.boardState[row][col];

    if (gameState.selectedSquare) {
      const fromSquare = gameState.boardState[gameState.selectedSquare.row][gameState.selectedSquare.col];
      if (fromSquare.piece && fromSquare.piece.color === gameState.currentPlayer) {
        if (isBasicMoveValid(gameState.boardState, fromSquare.row, fromSquare.col, row, col, gameState.currentPlayer)) {
          makeMove(fromSquare, clickedSquare);
          return;
        }
      }
      setGameState(prev => ({ ...prev, selectedSquare: null }));
    } else {
      if (clickedSquare.piece && clickedSquare.piece.color === gameState.currentPlayer) {
        setGameState(prev => ({ ...prev, selectedSquare: { row, col } }));
      }
    }
  }, [gameState.isGameOver, gameState.boardState, gameState.selectedSquare, gameState.currentPlayer, makeMove]);

  const getAiSuggestions = useCallback(async () => {
    if (!gameState.isAiTutorEnabled || gameState.isGameOver) return;
    if (!gameState.difficulty && gameState.gameMode === 'pve') {
        toast({title: "Erro", description: "Dificuldade não definida para o tutor IA.", variant: "destructive"});
        return;
    }
    
    const fen = boardToFEN(gameState.boardState, gameState.currentPlayer);
    const history = gameState.moveHistory.map(m => m.notation).join(' ');
    
    try {
      const suggestions = await chessMoveSuggestions({
        currentBoardState: fen,
        difficultyLevel: gameState.difficulty || 'medium', 
        moveHistory: history,
      });
      setGameState(prev => ({ ...prev, aiSuggestions: suggestions }));
      toast({title: "Tutor IA", description: "Sugestões recebidas!"});
    } catch (error) {
      console.error("Erro ao obter sugestões da IA:", error);
      toast({title: "Erro no Tutor IA", description: "Não foi possível buscar sugestões.", variant: "destructive"});
      setGameState(prev => ({ ...prev, aiSuggestions: null }));
    }
  }, [gameState.isAiTutorEnabled, gameState.isGameOver, gameState.boardState, gameState.currentPlayer, gameState.moveHistory, gameState.difficulty, gameState.gameMode, toast]);

  const toggleAiTutor = useCallback(() => {
    const newIsEnabled = !gameState.isAiTutorEnabled;
    setGameState(prev => ({ ...prev, isAiTutorEnabled: newIsEnabled, aiSuggestions: null }));
    toast({ title: "Tutor IA", description: `Tutor IA ${newIsEnabled ? 'habilitado' : 'desabilitado'}.` });
  }, [gameState.isAiTutorEnabled, toast]);

  useEffect(() => {
    if (
      gameState.gameMode === 'pve' &&
      gameState.currentPlayer === 'black' && 
      !gameState.isGameOver
    ) {
      const makeAiMove = async () => {
        const fen = boardToFEN(gameState.boardState, gameState.currentPlayer);
        const history = gameState.moveHistory.map(m => m.notation).join(' ');
        try {
          const suggestions = await chessMoveSuggestions({
            currentBoardState: fen,
            difficultyLevel: gameState.difficulty || 'medium',
            moveHistory: history,
          });

          const movesToTry: string[] = [];
          if (suggestions.suggestedMove) {
            movesToTry.push(suggestions.suggestedMove);
          }
          if (suggestions.alternativeMoves) {
            movesToTry.push(...suggestions.alternativeMoves.filter(m => typeof m === 'string'));
          }

          let moveMade = false;
          for (const moveStr of movesToTry) {
            if (!moveStr) continue;

            const match = moveStr.match(/([a-h][1-8])-([a-h][1-8])/);
            if (match) {
              const fromNotation = match[1];
              const toNotation = match[2];
              const fromCol = fromNotation.charCodeAt(0) - 'a'.charCodeAt(0);
              const fromRow = 8 - parseInt(fromNotation[1]);
              const toCol = toNotation.charCodeAt(0) - 'a'.charCodeAt(0);
              const toRow = 8 - parseInt(toNotation[1]);

              if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
                  toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
                  console.warn("IA sugeriu movimento com coordenadas fora do tabuleiro:", moveStr);
                  continue; 
              }
              
              const fromSquareData = gameState.boardState[fromRow]?.[fromCol];
              const pieceToMove = fromSquareData?.piece;

              if (pieceToMove && pieceToMove.color === gameState.currentPlayer) { // currentPlayer is 'black'
                const targetSquareData = gameState.boardState[toRow]?.[toCol];
                if (targetSquareData) { // Check if 'to' square is valid
                  const targetPiece = targetSquareData.piece;
                  if (targetPiece && targetPiece.color === gameState.currentPlayer) {
                      console.warn("IA tentou capturar sua própria peça com o movimento:", moveStr);
                      continue; 
                  }
                  makeMove(fromSquareData, targetSquareData);
                  moveMade = true;
                  break; 
                } else {
                   console.warn("IA sugeriu um quadrado 'para' ('to') inválido ou inexistente:", toNotation, "para o movimento:", moveStr);
                }
              } else {
                console.warn(
                  "IA sugeriu um movimento inválido para a tentativa '", moveStr, "'. Detalhes: Peça não encontrada em 'de' (",
                  fromNotation,
                  ") ou a peça não pertence ao jogador IA (Pretas). Peça no local:", pieceToMove,
                  "Jogador Atual:", gameState.currentPlayer
                );
              }
            } else {
              console.warn("IA sugeriu movimento em formato não analisável:", moveStr);
            }
          } 

          if (!moveMade) {
            console.error("IA falhou em fazer um movimento válido após tentar todas as sugestões. O IA pode estar 'preso'.");
            toast({ title: "Problema com IA", description: "O IA não conseguiu encontrar um movimento válido.", variant: "destructive" });
          }

        } catch (error) {
          console.error("Erro crítico ao processar ou executar movimento da IA:", error);
          toast({ title: "Erro da IA", description: "Ocorreu um erro ao processar o movimento da IA.", variant: "destructive" });
        }
      };
      const timeoutId = setTimeout(makeAiMove, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.isGameOver, gameState.boardState, gameState.difficulty, gameState.moveHistory, makeMove, toast]);


  return {
    gameState,
    handleSquareClick,
    resetGame,
    saveGame,
    loadGame,
    getAiSuggestions,
    toggleAiTutor,
  };
}

