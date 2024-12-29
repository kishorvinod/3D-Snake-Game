import { useState, useCallback, useEffect } from 'react';
import { GameState, Direction, Position } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 200;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [],
    food: { x: 0, y: 0 },
    direction: Direction.Right,
    score: 0,
    gameOver: true
  });

  const generateFood = useCallback((snake: Position[]): Position => {
    let food: Position;
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE - GRID_SIZE / 2),
        y: Math.floor(Math.random() * GRID_SIZE - GRID_SIZE / 2)
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }, []);

  const startGame = useCallback(() => {
    const initialSnake: Position[] = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
      x: -i,
      y: 0
    }));

    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: Direction.Right,
      score: 0,
      gameOver: false
    });
  }, [generateFood]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const keyDirections: { [key: string]: Direction } = {
      ArrowUp: Direction.Up,
      ArrowDown: Direction.Down,
      ArrowLeft: Direction.Left,
      ArrowRight: Direction.Right
    };

    if (keyDirections[event.key]) {
      const newDirection = keyDirections[event.key];
      setGameState(prev => {
        // Prevent 180-degree turns
        const oppositeDirections = {
          [Direction.Up]: Direction.Down,
          [Direction.Down]: Direction.Up,
          [Direction.Left]: Direction.Right,
          [Direction.Right]: Direction.Left
        };

        if (oppositeDirections[prev.direction] === newDirection) {
          return prev;
        }

        return { ...prev, direction: newDirection };
      });
    }
  }, []);

  useEffect(() => {
    if (gameState.gameOver) return;

    const moveSnake = () => {
      setGameState(prev => {
        const newHead = { ...prev.snake[0] };

        switch (prev.direction) {
          case Direction.Up:
            newHead.y--;
            break;
          case Direction.Down:
            newHead.y++;
            break;
          case Direction.Left:
            newHead.x--;
            break;
          case Direction.Right:
            newHead.x++;
            break;
        }

        // Check collision with walls
        if (
          newHead.x < -GRID_SIZE / 2 ||
          newHead.x >= GRID_SIZE / 2 ||
          newHead.y < -GRID_SIZE / 2 ||
          newHead.y >= GRID_SIZE / 2
        ) {
          return { ...prev, gameOver: true };
        }

        // Check collision with self
        if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          return { ...prev, gameOver: true };
        }

        const newSnake = [newHead, ...prev.snake];

        // Check if food is eaten
        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          return {
            ...prev,
            snake: newSnake,
            food: generateFood(newSnake),
            score: prev.score + 10
          };
        }

        newSnake.pop();
        return { ...prev, snake: newSnake };
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [gameState.gameOver, generateFood]);

  return { gameState, startGame, handleKeyPress };
};