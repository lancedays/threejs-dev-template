import { Engine, Scene, Box, Sphere, Torus } from './src/index.js';

// Create the engine (handles rendering)
const engine = new Engine();

// Create a scene (handles camera, lights, objects)
const scene = new Scene({ background: '#0a0a1f' });

// Add some objects with simple, readable syntax
scene.add(
    new Box({ color: 'coral', x: -3 })
        .spin({ speedX: 0.5, speedY: 1 })
);

scene.add(
    new Sphere({ color: 'dodgerblue', x: 0, radius: 0.8 })
        .float({ amplitude: 0.5, speed: 2 })
);

scene.add(
    new Torus({ color: '#ff00ff', x: 3, tube: 0.3 })
        .spin({ speedX: 0.5, speedY: 1 }).float({ amplitude: 0.5, speed: 1 })
);

// Add a floor
scene.add(
    new Box({
        color: 'darkgray',
        width: 10000,
        height: 0.1,
        depth: 10000,
        y: -2
    })
);

// Start the engine
engine.run(scene);
