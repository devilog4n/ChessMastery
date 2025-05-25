import type { BoardState, Piece, PieceSymbol, PieceType, PlayerColor, Square } from '@/types/chess';

const PIECE_SETUP: { [key in PieceType]: { white: PieceSymbol, black: PieceSymbol } } = {
  king: { white: 'K', black: 'k' },
  queen: { white: 'Q', black: 'q' },
  rook: { white: 'R', black: 'r' },
  bishop: { white: 'B', black: 'b' },
  knight: { white: 'N', black: 'n' },
  pawn: { white: 'P', black: 'p' },
};

export const UNICODE_PIECES: Record<PieceSymbol, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟︎',
};


function createPiece(type: PieceType, color: PlayerColor): Piece {
  return { type, color, symbol: PIECE_SETUP[type][color] };
}

export function getInitialBoardState(): BoardState {
  const board: BoardState = Array(8).fill(null).map((_, r) =>
    Array(8).fill(null).map((_, c) => ({ row: r, col: c, piece: null }))
  );

  // Pawns
  for (let i = 0; i < 8; i++) {
    board[1][i].piece = createPiece('pawn', 'black');
    board[6][i].piece = createPiece('pawn', 'white');
  }

  // Rooks
  board[0][0].piece = createPiece('rook', 'black');
  board[0][7].piece = createPiece('rook', 'black');
  board[7][0].piece = createPiece('rook', 'white');
  board[7][7].piece = createPiece('rook', 'white');

  // Knights
  board[0][1].piece = createPiece('knight', 'black');
  board[0][6].piece = createPiece('knight', 'black');
  board[7][1].piece = createPiece('knight', 'white');
  board[7][6].piece = createPiece('knight', 'white');

  // Bishops
  board[0][2].piece = createPiece('bishop', 'black');
  board[0][5].piece = createPiece('bishop', 'black');
  board[7][2].piece = createPiece('bishop', 'white');
  board[7][5].piece = createPiece('bishop', 'white');

  // Queens
  board[0][3].piece = createPiece('queen', 'black');
  board[7][3].piece = createPiece('queen', 'white');

  // Kings
  board[0][4].piece = createPiece('king', 'black');
  board[7][4].piece = createPiece('king', 'white');
  
  return board;
}

export function boardToFEN(boardState: BoardState, currentPlayer: PlayerColor): string {
  let fen = '';
  for (let r = 0; r < 8; r++) {
    let emptySquares = 0;
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c].piece;
      if (piece) {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        fen += piece.symbol;
      } else {
        emptySquares++;
      }
    }
    if (emptySquares > 0) {
      fen += emptySquares;
    }
    if (r < 7) {
      fen += '/';
    }
  }

  // For simplicity, active color, castling, en passant, halfmove clock, fullmove number are simplified
  fen += ` ${currentPlayer === 'white' ? 'w' : 'b'}`;
  fen += ' KQkq - 0 1'; // Simplified castling, en passant, move counters

  return fen;
}

export function squareToNotation(row: number, col: number): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + col);
  const rank = (8 - row).toString();
  return file + rank;
}

// Basic move validation: can only move to an empty square or opponent's square.
// Does not check for piece-specific rules, checks, checkmates, etc.
export function isValidMove(
  board: BoardState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentPlayer: PlayerColor
): boolean {
  const pieceToMove = board[fromRow][fromCol].piece;
  if (!pieceToMove || pieceToMove.color !== currentPlayer) {
    return false; // No piece to move or not current player's piece
  }

  const targetPiece = board[toRow][toCol].piece;
  if (targetPiece && targetPiece.color === currentPlayer) {
    return false; // Cannot capture own piece
  }
  
  // This is where piece-specific move logic would go.
  // For this iteration, any move to an empty or opponent square is "valid" from this function's perspective.
  // The AI will provide actual valid chess moves.
  // A very minimal check for pawn movement direction for non-captures
  if (pieceToMove.type === 'pawn' && fromCol === toCol && targetPiece === null) {
    if (pieceToMove.color === 'white' && toRow >= fromRow) return false; // White pawns move to smaller row index
    if (pieceToMove.color === 'black' && toRow <= fromRow) return false; // Black pawns move to larger row index
  }


  return true; // Simplified: allows move if target is not own piece.
}

// A very simplified check for game over: if a king is captured.
export function checkGameOver(boardState: BoardState): { isGameOver: boolean, winner: PlayerColor | null } {
  let whiteKingFound = false;
  let blackKingFound = false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c].piece;
      if (piece && piece.type === 'king') {
        if (piece.color === 'white') whiteKingFound = true;
        if (piece.color === 'black') blackKingFound = true;
      }
    }
  }

  if (!whiteKingFound) return { isGameOver: true, winner: 'black' };
  if (!blackKingFound) return { isGameOver: true, winner: 'white' };
  
  return { isGameOver: false, winner: null };
}
