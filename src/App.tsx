import React from 'react';
import SnakeGame from './components/SnakeGame';
import { Gamepad2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2">
        <Gamepad2 className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-white">3D Snake Game</h1>
      </div>
      <SnakeGame />
    </div>
  );
}

export default App;