import { Chess, Square } from 'chess.js';
import { PieceType } from '../types/chess';

export type AiDifficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  name: string;
  title: string;
  description: string;
  skillLevel: number;
  depth: number;
  movetime: number;
}

export const DIFFICULTY_CONFIGS: Record<AiDifficulty, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    title: 'Squire Malakar',
    description: 'A novice commander prone to tactical oversights.',
    skillLevel: 1,
    depth: 2,
    movetime: 500
  },
  medium: {
    name: 'Medium',
    title: 'General Malakar',
    description: 'A seasoned military commander with balanced strategic depth.',
    skillLevel: 9,
    depth: 6,
    movetime: 900
  },
  hard: {
    name: 'Hard',
    title: 'Emperor Malakar',
    description: 'An indomitable warlord analyzing complex deep tactics.',
    skillLevel: 20,
    depth: 12,
    movetime: 1500
  }
};

export interface AiMoveResult {
  from: Square;
  to: Square;
  promotion?: PieceType;
}

// Piece value mapping for minimax fallback
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

class StockfishEngine {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private pendingResolver: ((move: AiMoveResult | null) => void) | null = null;
  private workerFailed: boolean = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      this.workerFailed = true;
      return;
    }

    try {
      this.worker = new Worker('/stockfish.js');
      this.worker.onmessage = (e) => {
        const line = typeof e.data === 'string' ? e.data : '';
        this.handleMessage(line);
      };

      this.worker.onerror = (err) => {
        console.warn('Stockfish worker error, switching to tactical minimax fallback:', err);
        this.workerFailed = true;
        if (this.pendingResolver) {
          const res = this.pendingResolver;
          this.pendingResolver = null;
          res(null);
        }
      };

      this.worker.postMessage('uci');
      this.worker.postMessage('isready');
    } catch (err) {
      console.warn('Failed to construct Stockfish Worker:', err);
      this.workerFailed = true;
    }
  }

  private handleMessage(line: string) {
    if (line === 'readyok' || line.includes('readyok')) {
      this.isReady = true;
    }

    if (line.startsWith('bestmove')) {
      const parts = line.split(' ');
      const moveStr = parts[1]; // e.g. "e7e5" or "e7e8q"
      if (this.pendingResolver) {
        const resolver = this.pendingResolver;
        this.pendingResolver = null;

        if (!moveStr || moveStr === '(none)') {
          resolver(null);
          return;
        }

        const from = moveStr.slice(0, 2) as Square;
        const to = moveStr.slice(2, 4) as Square;
        const promotion = (moveStr[4] as PieceType) || undefined;
        resolver({ from, to, promotion });
      }
    }
  }

  public async getBestMove(fen: string, difficulty: AiDifficulty): Promise<AiMoveResult | null> {
    const config = DIFFICULTY_CONFIGS[difficulty];

    // If Web Worker is unavailable, use pure JS minimax fallback
    if (this.workerFailed || !this.worker) {
      return this.fallbackMinimaxMove(fen, config.depth);
    }

    return new Promise<AiMoveResult | null>((resolve) => {
      // Safety timeout in case engine hangs
      const timeoutId = setTimeout(() => {
        if (this.pendingResolver === resolve) {
          console.warn('Stockfish calculation timed out, using fallback move.');
          this.pendingResolver = null;
          resolve(this.fallbackMinimaxMove(fen, config.depth));
        }
      }, config.movetime + 2500);

      this.pendingResolver = (result) => {
        clearTimeout(timeoutId);
        if (!result) {
          resolve(this.fallbackMinimaxMove(fen, config.depth));
        } else {
          resolve(result);
        }
      };

      try {
        this.worker!.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
        this.worker!.postMessage(`position fen ${fen}`);
        this.worker!.postMessage(`go depth ${config.depth} movetime ${config.movetime}`);
      } catch (err) {
        clearTimeout(timeoutId);
        this.pendingResolver = null;
        resolve(this.fallbackMinimaxMove(fen, config.depth));
      }
    });
  }

  // Pure JavaScript Minimax fallback with material and positional evaluation
  private fallbackMinimaxMove(fen: string, maxDepth: number): AiMoveResult | null {
    try {
      const chess = new Chess(fen);
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return null;

      // Depth limit for JS single-thread performance (max 3)
      const depth = Math.min(maxDepth, 3);
      let bestMove = moves[0];
      let bestScore = -Infinity;

      // Randomize slight move order for varied games
      moves.sort(() => Math.random() - 0.5);

      for (const move of moves) {
        chess.move(move);
        const score = -this.minimax(chess, depth - 1, -Infinity, Infinity, false);
        chess.undo();

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return {
        from: bestMove.from,
        to: bestMove.to,
        promotion: (bestMove.promotion as PieceType) || undefined
      };
    } catch {
      return null;
    }
  }

  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluateBoard(chess);
    }

    const moves = chess.moves({ verbose: true });
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const ev = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const ev = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  private evaluateBoard(chess: Chess): number {
    if (chess.isCheckmate()) {
      return chess.turn() === 'b' ? -99999 : 99999;
    }
    if (chess.isDraw() || chess.isStalemate()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          const val = PIECE_VALUES[piece.type] || 0;
          // Black (AI) is maximizing positive score
          if (piece.color === 'b') {
            score += val;
            // Center control bonus
            if ((r === 3 || r === 4) && (c === 3 || c === 4)) score += 15;
          } else {
            score -= val;
            if ((r === 3 || r === 4) && (c === 3 || c === 4)) score -= 15;
          }
        }
      }
    }
    return score;
  }
}

export const stockfishEngine = new StockfishEngine();
