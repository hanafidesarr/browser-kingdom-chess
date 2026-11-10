import React from 'react';
import { useChessGame } from './game/useChessGame';
import { PortraitLayout } from './components/ui/PortraitLayout';

export const App: React.FC = () => {
  const {
    board,
    piecesList,
    turn,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
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
    resolvePromotion,
    cancelPromotion,
    undoMove,
    restartGame
  } = useChessGame();

  return (
    <main className="w-full h-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#04060a] flex items-center justify-center overflow-hidden">
      <PortraitLayout
        board={board}
        piecesList={piecesList}
        turn={turn}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        lastMove={lastMove}
        isCheck={isCheck}
        isCheckmate={isCheckmate}
        isStalemate={isStalemate}
        isDraw={isDraw}
        checkedKingSquare={checkedKingSquare}
        capturedPieces={capturedPieces}
        whiteTime={whiteTime}
        blackTime={blackTime}
        moveHistory={moveHistory}
        pendingPromotion={pendingPromotion}
        isAiThinking={isAiThinking}
        isAnimating={isAnimating}
        activeAnimation={activeAnimation}
        difficulty={difficulty}
        isGameStarted={isGameStarted}
        onSetDifficulty={setDifficulty}
        onStartGame={startGameWithDifficulty}
        onSquareClick={selectSquare}
        onSelectPromotion={resolvePromotion}
        onCancelPromotion={cancelPromotion}
        onUndo={undoMove}
        onRestart={restartGame}
      />
    </main>
  );
};

export default App;
