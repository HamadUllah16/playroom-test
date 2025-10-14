'use client';

import { useQueryParamContext } from '@/contexts/QueryParamContext';

export interface GameEngine {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  docUrl?: string;
}

const gameEngines: GameEngine[] = [
  {
    id: 'unity',
    name: 'Unity',
    description: 'Popular 3D/2D game engine with C# support',
    icon: '🎮',
    color: 'bg-blue-500',
    docUrl: '/docs/gameengine/unity'
  },
  {
    id: 'phaser',
    name: 'Phaser',
    description: 'Fast 2D game framework for web browsers',
    icon: '⚡',
    color: 'bg-orange-500',
    docUrl: '/docs/gameengine/phaser'
  },
  {
    id: 'playcanvas',
    name: 'PlayCanvas',
    description: 'WebGL game engine for 3D games',
    icon: '🌐',
    color: 'bg-green-500',
    docUrl: '/docs/gameengine/playcanvas'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Vanilla JavaScript for web games',
    icon: '📜',
    color: 'bg-yellow-500',
    docUrl: '/docs/gameengine/JavaScript-TS/javascript'
  },
  {
    id: 'react',
    name: 'React',
    description: 'React framework with hooks and components',
    icon: '⚛️',
    color: 'bg-cyan-500',
    docUrl: '/docs/gameengine/JavaScript-TS/react'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    description: '3D library for creating immersive web experiences',
    icon: '🎯',
    color: 'bg-purple-500',
    docUrl: '/docs/gameengine/JavaScript-TS/threejs'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Server-side JavaScript runtime',
    icon: '🟢',
    color: 'bg-green-600',
    docUrl: '/docs/gameengine/nodejs'
  },
  {
    id: 'react-three-fiber',
    name: 'React Three Fiber',
    description: 'React renderer for Three.js',
    icon: '🎨',
    color: 'bg-pink-500',
    docUrl: '/docs/gameengine/JavaScript-TS/react-three-fiber'
  },
  {
    id: 'pixijs',
    name: 'PixiJS',
    description: 'Fast 2D WebGL renderer',
    icon: '🎪',
    color: 'bg-red-500',
    docUrl: '/docs/gameengine/pixijs'
  }
];

interface GameEngineSelectorProps {
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'list';
  showDescription?: boolean;
}

export function GameEngineSelector({ 
  title = "Supported Engines",
  subtitle = "Click on any engine to see engine-specific content across all docs pages",
  layout = 'grid',
  showDescription = true 
}: GameEngineSelectorProps) {
  const { queryParams, updateQueryParams } = useQueryParamContext();
  const selectedEngine = queryParams.gameengine as string;
  const selectedEngineData = gameEngines.find(engine => engine.id === selectedEngine);

  const handleEngineClick = (engine: GameEngine) => {
    updateQueryParams({ 
      gameengine: engine.id
    }, { replace: true });
  };

  const clearSelection = () => {
    updateQueryParams({ gameengine: undefined }, { replace: true, preserveOthers: true });
  };

  return (
    <div className="my-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-100">{title}</h3>
        {subtitle && <p className="text-gray-300 text-sm mb-3">{subtitle}</p>}
        
        {selectedEngine && selectedEngineData && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-900 rounded-lg border border-indigo-700">
            <span className="text-sm text-indigo-100">
              <strong>Selected Engine:</strong> {selectedEngineData.name}
            </span>
            <button
              onClick={clearSelection}
              className="text-indigo-300 hover:text-indigo-200 text-sm underline"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      <div className={`${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
        {gameEngines.map((engine) => {
          const isSelected = selectedEngine === engine.id;
          
          return (
            <button
              key={engine.id}
              onClick={() => handleEngineClick(engine)}
              className={`
                p-4 rounded-lg border text-left transition-all duration-200 
                hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${isSelected 
                  ? 'border-indigo-400 bg-indigo-800 shadow-lg' 
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{engine.icon}</span>
                <div className="flex-1">
                  <h4 className={`font-semibold ${isSelected ? 'text-indigo-100' : 'text-gray-100'}`}>
                    {engine.name}
                  </h4>
                  {showDescription && (
                    <p className={`text-sm mt-1 ${isSelected ? 'text-indigo-200' : 'text-gray-300'}`}>
                      {engine.description}
                    </p>
                  )}
                  {isSelected && (
                    <div className="mt-2 text-xs text-indigo-300 font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedEngine && selectedEngineData && (
        <div className="mt-4 p-3 bg-green-900 rounded-lg border border-green-700">
          <p className="text-sm text-green-100">
            🎉 <strong>Engine selected!</strong> Navigate to other docs pages to see {selectedEngineData.name}-specific content.
          </p>
        </div>
      )}
    </div>
  );
}

// Export the game engines data for use in other components
export { gameEngines }; 