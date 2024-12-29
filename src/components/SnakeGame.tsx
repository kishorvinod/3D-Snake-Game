import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameState } from '../types/game';

const SnakeGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameState, startGame, handleKeyPress } = useGameLogic();
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 20);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Snake body geometry
    const snakeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const snakeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // Food geometry
    const foodGeometry = new THREE.SphereGeometry(0.5);
    const foodMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Clear previous snake segments
      scene.children = scene.children.filter(
        child => child instanceof THREE.GridHelper || child instanceof THREE.Light
      );

      // Render snake
      gameState.snake.forEach((segment, index) => {
        const snakeCube = new THREE.Mesh(snakeGeometry, snakeMaterial);
        snakeCube.position.set(segment.x, 0.5, segment.y);
        scene.add(snakeCube);
      });

      // Render food
      const food = new THREE.Mesh(foodGeometry, foodMaterial);
      food.position.set(gameState.food.x, 0.5, gameState.food.y);
      scene.add(food);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [gameState, handleKeyPress]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded-lg">
        <p className="text-2xl font-bold">Score: {gameState.score}</p>
        {gameState.gameOver && (
          <div>
            <p className="text-red-500 font-bold">Game Over!</p>
            <button
              onClick={startGame}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;