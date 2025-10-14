'use client';

import { useQueryParamContext } from '@/contexts/QueryParamContext';
import { gameEngines} from './GameEngineSelector';

interface EngineContent {
  [key: string]: {
    installation: string;
    quickStart: string;
    codeExample: string;
    tips: string[];
    relatedLinks: Array<{ title: string; url: string }>;
  };
}

const engineContent: EngineContent = {
  unity: {
    installation: `Install via Unity Package Manager:
1. Open Unity Hub
2. Go to Package Manager
3. Add package from git URL: https://github.com/playroomkit/unity-sdk`,
    quickStart: `using PlayroomKit;

void Start() {
    PlayroomKit.InsertCoin(() => {
        Debug.Log("Connected to Playroom!");
    });
}`,
    codeExample: `// Unity C# Example
public class GameManager : MonoBehaviour {
    void Start() {
        PlayroomKit.InsertCoin(OnPlayroomConnected);
    }
    
    void OnPlayroomConnected() {
        PlayroomKit.OnPlayerJoin(OnPlayerJoin);
    }
    
    void OnPlayerJoin(PlayroomKit.Player player) {
        Debug.Log($"Player {player.id} joined!");
    }
}`,
    tips: [
      "Use Unity's built-in networking for complex physics",
      "PlayroomKit handles cross-platform player state",
      "Test multiplayer in Unity Play Mode"
    ],
    relatedLinks: [
      { title: "Unity Documentation", url: "/docs/gameengine/unity" },
      { title: "Unity Examples", url: "/docs/templates#unity" }
    ]
  },
  phaser: {
    installation: `npm install playroomkit
# or
<script src="https://unpkg.com/playroomkit@latest/dist/index.js"></script>`,
    quickStart: `import { insertCoin, onPlayerJoin } from 'playroomkit';

class GameScene extends Phaser.Scene {
    async create() {
        await insertCoin();
        onPlayerJoin(this.handlePlayerJoin.bind(this));
    }
}`,
    codeExample: `// Phaser 3 Example
class MultiplayerScene extends Phaser.Scene {
    async create() {
        await insertCoin();
        
        onPlayerJoin((player) => {
            // Create player sprite
            const sprite = this.add.sprite(100, 100, 'player');
            this.players.set(player.id, sprite);
        });
    }
    
    update() {
        // Sync player positions
        this.players.forEach((sprite, playerId) => {
            const player = getPlayer(playerId);
            const pos = player.getState('position');
            if (pos) {
                sprite.setPosition(pos.x, pos.y);
            }
        });
    }
}`,
    tips: [
      "Use Phaser's built-in input handling with PlayroomKit state",
      "Sync only essential game state for performance",
      "Use Phaser's physics system locally, sync results"
    ],
    relatedLinks: [
      { title: "Phaser Documentation", url: "/docs/gameengine/phaser" },
      { title: "Phaser Examples", url: "/docs/templates#phaser" }
    ]
  },
  react: {
    installation: `npm install playroomkit`,
    quickStart: `import { usePlayroom } from 'playroomkit/react';

function App() {
    const { players, myPlayer } = usePlayroom();
    
    return (
        <div>
            {players.map(player => (
                <div key={player.id}>{player.getProfile().name}</div>
            ))}
        </div>
    );
}`,
    codeExample: `// React Hooks Example
import { usePlayroom, usePlayerState } from 'playroomkit/react';

function GameComponent() {
    const { players, myPlayer, isHost } = usePlayroom();
    const [position, setPosition] = usePlayerState('position', { x: 0, y: 0 });
    
    const movePlayer = (direction) => {
        setPosition(prev => ({
            x: prev.x + (direction === 'right' ? 10 : -10),
            y: prev.y
        }));
    };
    
    return (
        <div className="game-area">
            {players.map(player => (
                <PlayerAvatar key={player.id} player={player} />
            ))}
            <Controls onMove={movePlayer} />
        </div>
    );
}`,
    tips: [
      "Use React hooks for clean state management",
      "Leverage React's component lifecycle with Playroom events",
      "Use useEffect for cleanup when players leave"
    ],
    relatedLinks: [
      { title: "React Guide", url: "/docs/gameengine/JavaScript-TS/react" },
      { title: "React Hooks Reference", url: "/docs/gameengine/JavaScript-TS/react#hooks" }
    ]
  },
  threejs: {
    installation: `npm install playroomkit three`,
    quickStart: `import * as THREE from 'three';
import { insertCoin, onPlayerJoin } from 'playroomkit';

const scene = new THREE.Scene();
await insertCoin();
onPlayerJoin(handlePlayerJoin);`,
    codeExample: `// Three.js Example
import * as THREE from 'three';
import { insertCoin, onPlayerJoin, myPlayer } from 'playroomkit';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.players = new Map();
    }
    
    async init() {
        await insertCoin();
        onPlayerJoin(this.handlePlayerJoin.bind(this));
        this.animate();
    }
    
    handlePlayerJoin(player) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: player.getProfile().color.hex });
        const cube = new THREE.Mesh(geometry, material);
        
        this.scene.add(cube);
        this.players.set(player.id, cube);
    }
    
    animate() {
        // Update player positions from state
        this.players.forEach((mesh, playerId) => {
            const player = getPlayer(playerId);
            const pos = player.getState('position');
            if (pos) {
                mesh.position.set(pos.x, pos.y, pos.z);
            }
        });
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }
}`,
    tips: [
      "Use Three.js for 3D rendering, PlayroomKit for networking",
      "Sync camera positions for shared viewing experiences",
      "Optimize by syncing only visible objects"
    ],
    relatedLinks: [
      { title: "Three.js Guide", url: "/docs/gameengine/JavaScript-TS/threejs" },
      { title: "3D Examples", url: "/docs/templates#threejs" }
    ]
  },
  javascript: {
    installation: `<script src="https://unpkg.com/playroomkit@latest/dist/index.js"></script>
// or
npm install playroomkit`,
    quickStart: `// Using CDN
const { insertCoin, onPlayerJoin } = window.Playroom;

insertCoin().then(() => {
    console.log('Connected!');
    onPlayerJoin(handlePlayerJoin);
});`,
    codeExample: `// Vanilla JavaScript Example
class SimpleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.players = new Map();
    }
    
    async init() {
        await insertCoin();
        onPlayerJoin(this.handlePlayerJoin.bind(this));
        this.gameLoop();
    }
    
    handlePlayerJoin(player) {
        this.players.set(player.id, {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            color: player.getProfile().color.hex
        });
    }
    
    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all players
        this.players.forEach((playerData, playerId) => {
            this.ctx.fillStyle = playerData.color;
            this.ctx.fillRect(playerData.x, playerData.y, 20, 20);
        });
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

const game = new SimpleGame();
game.init();`,
    tips: [
      "Perfect for learning multiplayer concepts",
      "Use Canvas API or WebGL for rendering",
      "Great for prototyping game ideas quickly"
    ],
    relatedLinks: [
      { title: "JavaScript Guide", url: "/docs/gameengine/JavaScript-TS/javascript" },
      { title: "Canvas Examples", url: "/docs/templates#javascript" }
    ]
  },
  pixijs: {
    installation: `npm install playroomkit pixi.js`,
    quickStart: `import * as PIXI from 'pixi.js';
import { insertCoin, onPlayerJoin } from 'playroomkit';

const app = new PIXI.Application();
await insertCoin();
onPlayerJoin(handlePlayerJoin);`,
    codeExample: `// PixiJS Example
import * as PIXI from 'pixi.js';
import { insertCoin, onPlayerJoin, myPlayer } from 'playroomkit';

class PixiGame {
    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb
        });
        this.playerSprites = new Map();
    }
    
    async init() {
        document.body.appendChild(this.app.view);
        await insertCoin();
        onPlayerJoin(this.handlePlayerJoin.bind(this));
        this.app.ticker.add(this.gameLoop.bind(this));
    }
    
    handlePlayerJoin(player) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(parseInt(player.getProfile().color.hex.slice(1), 16));
        graphics.drawCircle(0, 0, 20);
        graphics.endFill();
        
        this.app.stage.addChild(graphics);
        this.playerSprites.set(player.id, graphics);
    }
    
    gameLoop() {
        // Update sprite positions from player state
        this.playerSprites.forEach((sprite, playerId) => {
            const player = getPlayer(playerId);
            const pos = player.getState('position');
            if (pos) {
                sprite.x = pos.x;
                sprite.y = pos.y;
            }
        });
    }
}`,
    tips: [
      "PixiJS excels at 2D sprite-based games",
      "Use PIXI.Ticker for smooth animations",
      "Leverage PIXI's built-in sprite batching for performance"
    ],
    relatedLinks: [
      { title: "PixiJS Guide", url: "/docs/gameengine/pixijs" },
      { title: "2D Game Examples", url: "/docs/templates#pixijs" }
    ]
  },
  playcanvas: {
    installation: `// Add PlayroomKit to your PlayCanvas project
// Include in your HTML file:
<script src="https://unpkg.com/playroomkit@latest/dist/index.js"></script>`,
    quickStart: `// PlayCanvas Script
var GameManager = pc.createScript('gameManager');

GameManager.prototype.initialize = function() {
    Playroom.insertCoin().then(() => {
        console.log('Connected to PlayroomKit!');
        Playroom.onPlayerJoin(this.onPlayerJoin.bind(this));
    });
};`,
    codeExample: `// PlayCanvas Multiplayer Example
var MultiplayerManager = pc.createScript('multiplayerManager');

MultiplayerManager.prototype.initialize = function() {
    this.players = new Map();
    
    Playroom.insertCoin().then(() => {
        Playroom.onPlayerJoin(this.onPlayerJoin.bind(this));
        this.startGameLoop();
    });
};

MultiplayerManager.prototype.onPlayerJoin = function(player) {
    // Create a cube for each player
    var cube = new pc.Entity();
    cube.addComponent('model', { type: 'box' });
    cube.addComponent('material', { 
        material: new pc.StandardMaterial()
    });
    
    this.app.root.addChild(cube);
    this.players.set(player.id, cube);
};

MultiplayerManager.prototype.startGameLoop = function() {
    this.app.on('update', this.update, this);
};

MultiplayerManager.prototype.update = function(dt) {
    // Sync player positions
    this.players.forEach((entity, playerId) => {
        var player = Playroom.getPlayer(playerId);
        var pos = player.getState('position');
        if (pos) {
            entity.setPosition(pos.x, pos.y, pos.z);
        }
    });
};`,
    tips: [
      "Use PlayCanvas entity-component system with PlayroomKit state",
      "Leverage PlayCanvas's built-in physics for local calculations",
      "Optimize by syncing only essential transform data"
    ],
    relatedLinks: [
      { title: "PlayCanvas Documentation", url: "/docs/gameengine/playcanvas" },
      { title: "PlayCanvas Examples", url: "/docs/templates#playcanvas" }
    ]
  },
  nodejs: {
    installation: `npm install playroomkit`,
    quickStart: `const { insertCoin, onPlayerJoin } = require('playroomkit');

// Server-side setup
insertCoin().then(() => {
    console.log('Server connected to PlayroomKit');
    onPlayerJoin(handlePlayerJoin);
});`,
    codeExample: `// Node.js Server Example
const express = require('express');
const { insertCoin, onPlayerJoin, getState, setState } = require('playroomkit');

const app = express();
app.use(express.json());

class GameServer {
    constructor() {
        this.players = new Map();
        this.gameState = { score: 0, level: 1 };
    }
    
    async start() {
        await insertCoin();
        onPlayerJoin(this.handlePlayerJoin.bind(this));
        
        // Sync game state periodically
        setInterval(() => {
            setState('gameState', this.gameState);
        }, 1000);
    }
    
    handlePlayerJoin(player) {
        console.log(\`Player \${player.id} joined the server\`);
        this.players.set(player.id, {
            position: { x: 0, y: 0 },
            health: 100,
            score: 0
        });
        
        // Send welcome message
        player.setState('welcome', 'Welcome to the server!');
    }
    
    updatePlayerPosition(playerId, position) {
        if (this.players.has(playerId)) {
            this.players.get(playerId).position = position;
            // Broadcast to other players
            setState(\`player_\${playerId}_position\`, position);
        }
    }
}

const gameServer = new GameServer();
gameServer.start();`,
    tips: [
      "Use Node.js for authoritative server logic",
      "Handle player validation and anti-cheat on server",
      "Implement rate limiting for client actions"
    ],
    relatedLinks: [
      { title: "Node.js Guide", url: "/docs/gameengine/nodejs" },
      { title: "Server Examples", url: "/docs/templates#nodejs" }
    ]
  },
  "react-three-fiber": {
    installation: `npm install playroomkit @react-three/fiber three`,
    quickStart: `import { Canvas } from '@react-three/fiber';
import { usePlayroom } from 'playroomkit/react';

function App() {
    const { players } = usePlayroom();
    
    return (
        <Canvas>
            {players.map(player => (
                <PlayerCube key={player.id} player={player} />
            ))}
        </Canvas>
    );
}`,
    codeExample: `// React Three Fiber Example
import { Canvas, useFrame } from '@react-three/fiber';
import { usePlayroom, usePlayerState } from 'playroomkit/react';
import { useRef, useState } from 'react';

function PlayerCube({ player }) {
    const meshRef = useRef();
    const [position, setPosition] = usePlayerState('position', [0, 0, 0]);
    const [hovered, setHovered] = useState(false);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.position.set(...position);
        }
    });
    
    const handleClick = () => {
        setPosition([
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        ]);
    };
    
    return (
        <mesh
            ref={meshRef}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
                color={hovered ? 'hotpink' : player.getProfile().color.hex} 
            />
        </mesh>
    );
}

function GameScene() {
    const { players, myPlayer } = usePlayroom();
    
    return (
        <Canvas camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {players.map(player => (
                <PlayerCube key={player.id} player={player} />
            ))}
        </Canvas>
    );
}`,
    tips: [
      "Combine React's declarative style with Three.js performance",
      "Use useFrame for smooth animations",
      "Leverage React Three Fiber's component ecosystem"
    ],
    relatedLinks: [
      { title: "R3F Guide", url: "/docs/gameengine/JavaScript-TS/react-three-fiber" },
      { title: "3D React Examples", url: "/docs/templates#react-three-fiber" }
    ]
  }
};

interface EngineSpecificContentProps {
  section?: 'installation' | 'quickstart' | 'example' | 'tips' | 'all';
  showTitle?: boolean;
}

export function EngineSpecificContent({ 
  section = 'all',
  showTitle = true 
}: EngineSpecificContentProps) {
  const { queryParams } = useQueryParamContext();
  const selectedEngine = queryParams.gameengine as string;
  const engine = gameEngines.find(e => e.id === selectedEngine);

  if (!selectedEngine || !engineContent[selectedEngine] || !engine) {
    return null;
  }

  const content = engineContent[selectedEngine];

  return (
    <div className="my-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{engine.icon}</span>
          <h3 className="text-lg font-semibold text-blue-800">
            {engine.name} Specific Content
          </h3>
        </div>
      )}

      {(section === 'installation' || section === 'all') && (
        <div className="mb-4">
          <h4 className="font-semibold text-blue-700 mb-2">📦 Installation</h4>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
            <code>{content.installation}</code>
          </pre>
        </div>
      )}

      {(section === 'quickstart' || section === 'all') && (
        <div className="mb-4">
          <h4 className="font-semibold text-blue-700 mb-2">🚀 Quick Start</h4>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
            <code>{content.quickStart}</code>
          </pre>
        </div>
      )}

      {(section === 'example' || section === 'all') && (
        <div className="mb-4">
          <h4 className="font-semibold text-blue-700 mb-2">💡 Complete Example</h4>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
            <code>{content.codeExample}</code>
          </pre>
        </div>
      )}

      {(section === 'tips' || section === 'all') && (
        <div className="mb-4">
          <h4 className="font-semibold text-blue-700 mb-2">💡 Tips & Best Practices</h4>
          <ul className="list-disc list-inside space-y-1">
            {content.tips.map((tip, index) => (
              <li key={index} className="text-blue-700 text-sm">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {(section === 'all') && (
        <div>
          <h4 className="font-semibold text-blue-700 mb-2">🔗 Related Documentation</h4>
          <div className="flex flex-wrap gap-2">
            {content.relatedLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for inline use
export function EngineQuickTip() {
  const { queryParams } = useQueryParamContext();
  const selectedEngine = queryParams.gameengine as string;
  const engine = gameEngines.find(e => e.id === selectedEngine);

  if (!selectedEngine || !engineContent[selectedEngine] || !engine) {
    return null;
  }

  return (
    <div className="my-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span>{engine.icon}</span>
        <span className="font-medium text-blue-800 text-sm">
          {engine.name} Tip
        </span>
      </div>
      <p className="text-blue-700 text-sm">
        {engineContent[selectedEngine].tips[0]}
      </p>
    </div>
  );
} 