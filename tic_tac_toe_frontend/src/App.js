import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Square UI component for a single cell in the board.
 * @param {{value: string, onClick: () => void, highlight: boolean}} props
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Square ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}

/**
 * Board UI: 3x3 grid for the game.
 * @param {{squares: string[], onSquareClick: (i:number)=>void, winningLine: number[]}} props
 */
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                highlight={winningLine && winningLine.includes(idx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Helper: Detect winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6],            // Diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] && 
      squares[a] === squares[b] && 
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /**
   * The app maintains board state, current player, game over, and theme.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [theme, setTheme] = useState('light');

  // Effect: Update theme attribute on document.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Effect: Check for winner/tie after every move.
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setGameOver(true);
    } else if (squares.every(val => val)) {
      setWinner(null);
      setWinningLine(null);
      setGameOver(true);
    } else {
      setWinner(null);
      setWinningLine(null);
      setGameOver(false);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (squares[idx] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Status Message
  let status = '';
  if (winner) status = `Winner: ${winner}`;
  else if (gameOver) status = "It's a tie!";
  else status = `Next turn: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <button
          className="ttt-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="ttt-main">
        <div className="ttt-status" role="status">{status}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart game"
        >
          Restart
        </button>
      </main>

      <footer className="ttt-footer">
        <div className="ttt-attribution">
          Two-player local &bull; Minimalistic UI &bull; <a href="https://github.com/facebook/react/" rel="noopener noreferrer" target="_blank" className="ttt-footer-link">React</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
