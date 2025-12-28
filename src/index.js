/**
 * EZ3D - A beginner-friendly wrapper around Three.js
 *
 * @example
 * import { Engine, Scene, Box, Sphere } from './src';
 *
 * const engine = new Engine();
 * const scene = new Scene();
 *
 * scene.add(new Box({ color: 'red' }).spin());
 * scene.add(new Sphere({ color: 'blue', y: 2 }).float());
 *
 * engine.run(scene);
 */

// Core
export { Engine } from './core/Engine.js';
export { Scene } from './core/Scene.js';

// Base class
export { GameObject } from './objects/GameObject.js';

// Primitives
export { Box } from './objects/primitives/Box.js';
export { Sphere } from './objects/primitives/Sphere.js';
export { Plane } from './objects/primitives/Plane.js';
export { Cylinder } from './objects/primitives/Cylinder.js';
export { Torus } from './objects/primitives/Torus.js';

// Utilities
export {
    NAMED_COLORS,
    parseColor,
    randomColor,
    randomNamedColor,
    lerpColor
} from './utils/colors.js';

// Re-export THREE for advanced usage
export * as THREE from 'three';
