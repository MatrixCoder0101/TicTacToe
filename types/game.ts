export type Player = 'X' | 'O' | null;
export type Board = Player[];

export interface GameResult {
  winner: Player;
  line: number[] | null;
}

export interface MinimaxResult {
  score: number;
  index?: number;
}
