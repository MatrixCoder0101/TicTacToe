import type { Board, Player, GameResult, MinimaxResult } from '@/types/game';

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function checkWinner(board: Board): GameResult | null {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        line: [a, b, c]
      };
    }
  }
  return null;
}

export function minimax(
  board: Board,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity,
  depth: number = 0
): MinimaxResult {
  const result = checkWinner(board);
  
  if (result?.winner === 'X') return { score: 10 - depth };
  if (result?.winner === 'O') return { score: depth - 10 };
  if (!board.includes(null)) return { score: 0 };

  const availableSpots = board
    .map((cell, index) => cell === null ? index : null)
    .filter((index): index is number => index !== null);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove: number | undefined;

    for (const spot of availableSpots) {
      board[spot] = 'X';
      const score = minimax(board, false, alpha, beta, depth + 1).score;
      board[spot] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = spot;
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }

    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove: number | undefined;

    for (const spot of availableSpots) {
      board[spot] = 'O';
      const score = minimax(board, true, alpha, beta, depth + 1).score;
      board[spot] = null;

      if (score < bestScore) {
        bestScore = score;
        bestMove = spot;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }

    return { score: bestScore, index: bestMove };
  }
}