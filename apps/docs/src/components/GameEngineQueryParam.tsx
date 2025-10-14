'use client';

import { useQueryParamContext } from '@/contexts/QueryParamContext';
import { gameEngines } from './GameEngineSelector';

interface GameEngineQueryParamProps {
  showSelector?: boolean;
  showCurrentSelection?: boolean;
  compact?: boolean;
}

export function GameEngineQueryParam({ 
  showSelector = true, 
  showCurrentSelection = true,
  compact = false 
}: GameEngineQueryParamProps) {
  const { queryParams, updateQueryParams } = useQueryParamContext();
  const selectedEngine = queryParams.gameengine as string;
  const selectedEngineData = gameEngines.find(engine => engine.id === selectedEngine);

  const handleEngineSelect = (engineId: string) => {
    updateQueryParams({
      gameengine: engineId
    }, { replace: true });
  };

  const clearEngine = () => {
    updateQueryParams({
      gameengine: undefined
    }, { replace: true, preserveOthers: true });
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-sm">
        <select 
          value={selectedEngine || ''}
          onChange={(e) => {
            if (e.target.value) {
              handleEngineSelect(e.target.value);
            } else {
              clearEngine();
            }
          }}
          className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 text-sm"
        >
          <option value="" className="bg-gray-800">Select Engine</option>
          {gameEngines.map(engine => (
            <option key={engine.id} value={engine.id} className="bg-gray-800">
              {engine.icon} {engine.name}
            </option>
          ))}
        </select>
        {selectedEngine && (
          <button
            onClick={clearEngine}
            className="text-xs text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="my-4 p-4 border border-gray-600 rounded-lg bg-gray-900">
      {showCurrentSelection && selectedEngine && selectedEngineData && (
        <div className="mb-3 p-2 bg-indigo-900 border border-indigo-700 rounded flex items-center justify-between">
          <span className="text-sm text-indigo-100">
            <strong>Game Engine:</strong> {selectedEngineData.name}
          </span>
          <button
            onClick={clearEngine}
            className="text-indigo-300 hover:text-indigo-200 text-sm underline"
          >
            Clear
          </button>
        </div>
      )}

      {showSelector && (
        <div>
          <h4 className="font-medium mb-2 text-gray-100">Select Game Engine:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {gameEngines.map(engine => {
              const isSelected = selectedEngine === engine.id;
              return (
                <button
                  key={engine.id}
                  onClick={() => handleEngineSelect(engine.id)}
                  className={`
                    p-2 rounded border text-left text-sm transition-colors
                    ${isSelected 
                      ? 'border-indigo-400 bg-indigo-800 text-indigo-100' 
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800 bg-gray-700 text-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{engine.icon}</span>
                    <span className="font-medium">{engine.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook to get current game engine
export function useGameEngine() {
  const { queryParams } = useQueryParamContext();
  const gameengine = queryParams.gameengine as string;
  
  const engineData = gameEngines.find(engine => engine.id === gameengine);
  
  return {
    gameengine,
    gameengineName: engineData?.name,
    engineData,
    hasEngine: !!gameengine
  };
} 