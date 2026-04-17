import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef(direction);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ' && !gameOver) {
        setIsPaused((p) => !p);
        return;
      }
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isPaused || gameOver) return;
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const intervalId = setInterval(moveSnake, 100);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, spawnFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPaused(true);
    setScore(s => {
      if (s > highScore) setHighScore(s);
      return s;
    });
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hard dark background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hard scan grid
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Cyan Snake
    ctx.fillStyle = '#00ffff';
    snake.forEach((segment, index) => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      // Create inset blocky detail
      if(index === 0) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(segment.x * CELL_SIZE + 4, segment.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
        ctx.fillStyle = '#00ffff';
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(segment.x * CELL_SIZE + 6, segment.y * CELL_SIZE + 6, CELL_SIZE - 12, CELL_SIZE - 12);
        ctx.fillStyle = '#00ffff';
      }
    });

    // Magenta Food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // Food inner detail
    ctx.fillStyle = '#000000';
    ctx.fillRect(food.x * CELL_SIZE + 6, food.y * CELL_SIZE + 6, CELL_SIZE - 12, CELL_SIZE - 12);

  }, [snake, food]);

  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      drawGame();
      animationFrameId = requestAnimationFrame(render);
    }
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawGame]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#000000] border-glitch relative">
      
      <div className="w-full flex justify-between items-end mb-4 font-pixel text-sm uppercase">
        <div>
            <span className="text-[#ff00ff]">SCORE_</span>
            <span className="text-[#00ffff]">{score.toString().padStart(4, '0')}</span>
        </div>
        <div>
            <span className="text-[#ff00ff]">HIGH_</span>
            <span className="text-[#00ffff]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-[#00ffff] bg-black">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {(isPaused || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center font-pixel p-6 border-4 border-[#ff00ff] bg-black">
              {gameOver ? (
                <>
                  <h2 className="text-[#ff00ff] mb-4 text-xl glitch" data-text="FATAL_ERR">FATAL_ERR</h2>
                  <p className="text-[#00ffff] mb-6 text-xs leading-relaxed uppercase">
                    COLLISION DETECTED<br/>SECTOR: {snake[0]?.x}_{snake[0]?.y}
                  </p>
                  <button
                    onClick={resetGame}
                    className="bg-[#ff00ff] text-black px-4 py-2 hover:bg-white transition-none uppercase cursor-pointer border-2 border-[#ff00ff]"
                  >
                    REBOOT_SYS
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-[#00ffff] mb-6 text-2xl glitch" data-text="SNAKE.EXE">SNAKE.EXE</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-[#00ffff] text-black px-6 py-2 hover:bg-[#ff00ff] transition-none uppercase cursor-pointer border-2 border-[#00ffff] hover:border-[#ff00ff]"
                  >
                    EXECUTE
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
