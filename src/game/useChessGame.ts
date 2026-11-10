import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color, Move } from 'chess.js';
import { BoardPiece, LegalMoveInfo, MoveRecord, PieceType, ActiveMoveAnimation } from '../types/chess';
import { soundManager } from './soundEffects';
import { stockfishEngine, AiDifficulty } from './stockfishService';

export interface UseChessGameReturn {
  board: (BoardPiece | null)[][];
  piecesList: BoardPiece[];
  turn: Color;
  selectedSquare: Square | null;
  legalMoves: LegalMoveInfo[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  checkedKingSquare: Square | null;
  capturedPieces: { w: PieceSymbol[]; b: PieceSymbol[] };
  whiteTime: number;
  blackTime: number;
  moveHistory: MoveRecord[];
  pendingPromotion: { from: Square; to: Square } | null;
  isAiThinking: boolean;
  isAnimating: boolean;
  activeAnimation: ActiveMoveAnimation | null;
  difficulty: AiDifficulty;
  isGameStarted: boolean;
  setDifficulty: (diff: AiDifficulty) => void;
  startGameWithDifficulty: (diff: AiDifficulty) => void;
  selectSquare: (sq: Square) => void;
  makeMove: (from: Square, to: Square, promotion?: PieceType) => boolean;
  resolvePromotion: (pieceType: PieceType) => void;
  cancelPromotion: () => void;
  undoMove: () => void;
  restartGame: () => void;
}

const INITIAL_TIME = 10 * 60; // 10 minutes

export function useChessGame(): UseChessGameReturn {
  const chessRef = useRef<Chess>(new Chess());
  const [, setBoardVersion] = useState<number>(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<LegalMoveInfo[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  const [difficulty, setDifficulty] = useState<AiDifficulty>('medium');
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeAnimation, setActiveAnimation] = useState<ActiveMoveAnimation | null>(null);
  const defeatedPieceRef = useRef<BoardPiece | null>(null);

  const [whiteTime, setWhiteTime] = useState<number>(INITIAL_TIME);
  const [blackTime, setBlackTime] = useState<number>(INITIAL_TIME);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  // Persistent 3D Piece IDs
  const pieceIdCounterRef = useRef<number>(1);
  const pieceMapRef = useRef<Map<string, string>>(new Map()); // square -> persistent id

  const chess = chessRef.current;
  const currentTurn = chess.turn();
  const checkStatus = chess.isCheck();
  const checkmateStatus = chess.isCheckmate();
  const stalemateStatus = chess.isStalemate();
  const drawStatus = chess.isDraw();

  // Find King square for check highlight
  let checkedKingSquare: Square | null = null;
  if (checkStatus) {
    const rawBoard = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = rawBoard[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          checkedKingSquare = piece.square;
          break;
        }
      }
      if (checkedKingSquare) break;
    }
  }

  // Calculate captured pieces
  const capturedPieces: { w: PieceSymbol[]; b: PieceSymbol[] } = {
    w: [], // captured black pieces (player's spoils)
    b: []  // captured white pieces (AI's spoils)
  };

  const initialPieceCount: Record<PieceSymbol, number> = {
    p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
  };
  const currentCount: { w: Record<PieceSymbol, number>; b: Record<PieceSymbol, number> } = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  };

  const currentBoard = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = currentBoard[r][c];
      if (p) {
        currentCount[p.color][p.type]++;
      }
    }
  }

  (['p', 'n', 'b', 'r', 'q'] as PieceSymbol[]).forEach((type) => {
    const missingWhite = initialPieceCount[type] - currentCount.w[type];
    for (let i = 0; i < missingWhite; i++) capturedPieces.b.push(type);

    const missingBlack = initialPieceCount[type] - currentCount.b[type];
    for (let i = 0; i < missingBlack; i++) capturedPieces.w.push(type);
  });

  // Flat list of pieces for 3D rendering with unique persistent IDs
  const piecesList: BoardPiece[] = [];
  const nextPieceMap = new Map<string, string>();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = currentBoard[r][c];
      if (piece) {
        let pieceId = pieceMapRef.current.get(piece.square);
        if (!pieceId) {
          pieceId = `${piece.color}-${piece.type}-${pieceIdCounterRef.current++}`;
        }
        nextPieceMap.set(piece.square, pieceId);
        piecesList.push({
          id: pieceId,
          type: piece.type,
          color: piece.color,
          square: piece.square
        });
      }
    }
  }
  pieceMapRef.current = nextPieceMap;

  // If a piece was captured in the active animation, keep it rendered with isDefeated until animation finishes!
  if (isAnimating && defeatedPieceRef.current) {
    piecesList.push(defeatedPieceRef.current);
  }

  // Clock countdown
  useEffect(() => {
    if (!isGameStarted || checkmateStatus || stalemateStatus || drawStatus) return;

    const timer = setInterval(() => {
      if (currentTurn === 'w') {
        setWhiteTime((prev) => Math.max(0, prev - 1));
      } else {
        setBlackTime((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, currentTurn, checkmateStatus, stalemateStatus, drawStatus]);

  // Execute move with smooth animation synchronization
  const makeMove = useCallback((from: Square, to: Square, promotionPiece?: PieceType): boolean => {
    try {
      const pieceOnFrom = chess.get(from);
      if (!pieceOnFrom) return false;

      // Promotion check
      const isPromotion =
        pieceOnFrom.type === 'p' &&
        ((pieceOnFrom.color === 'w' && to[1] === '8') ||
         (pieceOnFrom.color === 'b' && to[1] === '1'));

      if (isPromotion && !promotionPiece) {
        if (pieceOnFrom.color === 'w') {
          setPendingPromotion({ from, to });
          return false;
        } else {
          promotionPiece = 'q';
        }
      }

      // Check for capture target prior to engine move
      const targetPieceOnTo = chess.get(to);
      const isEnPassant = pieceOnFrom.type === 'p' && from[0] !== to[0] && !targetPieceOnTo;
      let capturedPieceData: BoardPiece | undefined = undefined;

      if (targetPieceOnTo) {
        const targetId = pieceMapRef.current.get(to) || `cap-${to}`;
        capturedPieceData = {
          id: targetId,
          type: targetPieceOnTo.type,
          color: targetPieceOnTo.color,
          square: to,
          isDefeated: true
        };
      } else if (isEnPassant) {
        const epSquare = `${to[0]}${from[1]}` as Square;
        const epPiece = chess.get(epSquare);
        if (epPiece) {
          const epId = pieceMapRef.current.get(epSquare) || `cap-${epSquare}`;
          capturedPieceData = {
            id: epId,
            type: epPiece.type,
            color: epPiece.color,
            square: epSquare,
            isDefeated: true
          };
        }
      }

      // Check for castling prior to engine move
      const isCastling =
        pieceOnFrom.type === 'k' &&
        Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2;

      let castlingRookInfo: { pieceId: string; from: Square; to: Square } | undefined = undefined;
      if (isCastling) {
        if (to === 'g1') {
          const rookId = pieceMapRef.current.get('h1') || 'w-r-castling';
          castlingRookInfo = { pieceId: rookId, from: 'h1', to: 'f1' };
        } else if (to === 'c1') {
          const rookId = pieceMapRef.current.get('a1') || 'w-r-castling';
          castlingRookInfo = { pieceId: rookId, from: 'a1', to: 'd1' };
        } else if (to === 'g8') {
          const rookId = pieceMapRef.current.get('h8') || 'b-r-castling';
          castlingRookInfo = { pieceId: rookId, from: 'h8', to: 'f8' };
        } else if (to === 'c8') {
          const rookId = pieceMapRef.current.get('a8') || 'b-r-castling';
          castlingRookInfo = { pieceId: rookId, from: 'a8', to: 'd8' };
        }
      }

      const moveResult = chess.move({
        from,
        to,
        promotion: promotionPiece || 'q'
      });

      if (moveResult) {
        // Move was legal!
        const movingId = pieceMapRef.current.get(from) || `${moveResult.color}-${moveResult.piece}`;
        pieceMapRef.current.delete(from);
        pieceMapRef.current.set(to, movingId);

        if (castlingRookInfo) {
          pieceMapRef.current.delete(castlingRookInfo.from);
          pieceMapRef.current.set(castlingRookInfo.to, castlingRookInfo.pieceId);
        }

        // Determine choreographed duration per specs (Normal: 500-750ms, Knight: 650-900ms)
        let duration = 620;
        if (moveResult.captured) {
          duration = 880; // combat attack + stylized impact + defeat sequence
        } else if (pieceOnFrom.type === 'n') {
          duration = 780; // knight special jumping arc
        } else if (isCastling) {
          duration = 700; // royal castling
        }

        defeatedPieceRef.current = capturedPieceData || null;

        const anim: ActiveMoveAnimation = {
          id: `anim-${Date.now()}`,
          from,
          to,
          pieceId: movingId,
          pieceType: moveResult.piece,
          color: moveResult.color,
          isCapture: !!moveResult.captured,
          capturedPiece: capturedPieceData,
          isCastling,
          castlingRook: castlingRookInfo,
          startTime: performance.now(),
          duration
        };

        setActiveAnimation(anim);
        setIsAnimating(true);
        setLastMove({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        setPendingPromotion(null);
        setBoardVersion((v) => v + 1);

        // Movement sound
        if (!moveResult.captured) {
          soundManager.playMove();
        }

        // Schedule animation conclusion
        setTimeout(() => {
          setIsAnimating(false);
          setActiveAnimation(null);
          defeatedPieceRef.current = null;
          setBoardVersion((v) => v + 1);

          if (chess.isCheckmate()) {
            soundManager.playVictory();
          } else if (chess.isCheck()) {
            soundManager.playCheck();
          }
        }, duration);

        // Record history
        setMoveHistory((prev) => [
          ...prev,
          {
            san: moveResult.san,
            from: moveResult.from,
            to: moveResult.to,
            piece: moveResult.piece,
            color: moveResult.color,
            captured: moveResult.captured,
            promotion: moveResult.promotion
          }
        ]);

        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [chess]);

  // Trigger NPC move when it's Black's turn and not currently animating
  useEffect(() => {
    if (!isGameStarted || isAnimating) return;
    if (chess.turn() === 'b' && !chess.isGameOver() && !isAiThinking) {
      setIsAiThinking(true);

      const fen = chess.fen();
      stockfishEngine.getBestMove(fen, difficulty).then((aiMove) => {
        setIsAiThinking(false);
        if (aiMove && chess.turn() === 'b') {
          makeMove(aiMove.from, aiMove.to, aiMove.promotion);
        }
      }).catch((err) => {
        console.error('AI move error:', err);
        setIsAiThinking(false);
      });
    }
  }, [isGameStarted, currentTurn, difficulty, chess, isAiThinking, isAnimating, makeMove]);

  // Player square selection
  const selectSquare = useCallback((sq: Square) => {
    // If not started, promotion pending, AI thinking, or movement animation active, block inputs!
    if (!isGameStarted || pendingPromotion || isAiThinking || isAnimating || activeAnimation) return;

    if (chess.turn() !== 'w') return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      const isLegal = legalMoves.some((m) => m.square === sq);
      if (isLegal) {
        makeMove(selectedSquare, sq);
        return;
      }
    }

    const piece = chess.get(sq);
    if (piece && piece.color === 'w') {
      soundManager.playSelect();
      setSelectedSquare(sq);

      const verboseMoves = chess.moves({ square: sq, verbose: true }) as Move[];
      const legal: LegalMoveInfo[] = verboseMoves.map((m) => ({
        square: m.to,
        isCapture: !!m.captured || m.flags.includes('e'),
        isEnPassant: m.flags.includes('e'),
        isCastling: m.flags.includes('k') || m.flags.includes('q')
      }));
      setLegalMoves(legal);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [isGameStarted, pendingPromotion, isAiThinking, isAnimating, chess, selectedSquare, legalMoves, makeMove]);

  // Promotion handlers
  const resolvePromotion = useCallback((pieceType: PieceType) => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, pieceType);
    }
  }, [pendingPromotion, makeMove]);

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, []);

  // Undo move
  const undoMove = useCallback(() => {
    if (isAiThinking || isAnimating) return;

    const movesToUndo = chess.turn() === 'w' && chess.history().length >= 2 ? 2 : 1;
    for (let i = 0; i < movesToUndo; i++) {
      chess.undo();
    }

    soundManager.playMove();
    setSelectedSquare(null);
    setLegalMoves([]);
    setPendingPromotion(null);
    defeatedPieceRef.current = null;
    setActiveAnimation(null);
    setIsAnimating(false);
    setBoardVersion((v) => v + 1);

    const hist = chess.history({ verbose: true });
    setMoveHistory(
      hist.map((m) => ({
        san: m.san,
        from: m.from,
        to: m.to,
        piece: m.piece,
        color: m.color,
        captured: m.captured,
        promotion: m.promotion
      }))
    );

    if (hist.length > 0) {
      const last = hist[hist.length - 1];
      setLastMove({ from: last.from, to: last.to });
    } else {
      setLastMove(null);
    }
  }, [chess, isAiThinking, isAnimating]);

  // Start game with difficulty
  const startGameWithDifficulty = useCallback((diff: AiDifficulty) => {
    setDifficulty(diff);
    setIsGameStarted(true);
    soundManager.playClick();
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    chess.reset();
    pieceMapRef.current.clear();
    pieceIdCounterRef.current = 1;
    defeatedPieceRef.current = null;
    setActiveAnimation(null);
    setIsAnimating(false);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setPendingPromotion(null);
    setIsAiThinking(false);
    setWhiteTime(INITIAL_TIME);
    setBlackTime(INITIAL_TIME);
    setMoveHistory([]);
    setBoardVersion((v) => v + 1);
    soundManager.playClick();
  }, [chess]);

  return {
    board: currentBoard as (BoardPiece | null)[][],
    piecesList,
    turn: currentTurn,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck: checkStatus,
    isCheckmate: checkmateStatus,
    isStalemate: stalemateStatus,
    isDraw: drawStatus,
    checkedKingSquare,
    capturedPieces,
    whiteTime,
    blackTime,
    moveHistory,
    pendingPromotion,
    isAiThinking,
    isAnimating,
    activeAnimation,
    difficulty,
    isGameStarted,
    setDifficulty,
    startGameWithDifficulty,
    selectSquare,
    makeMove,
    resolvePromotion,
    cancelPromotion,
    undoMove,
    restartGame
  };
}
