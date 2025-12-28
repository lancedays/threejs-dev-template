import * as THREE from 'three';
import { GameObject } from '../GameObject.js';

/**
 * Plane - A flat plane primitive. Useful for floors, walls, etc.
 *
 * @extends GameObject
 * @example
 * // Floor
 * new Plane({ color: 'gray', size: 10, rotationX: -90 });
 *
 * // Wall
 * new Plane({ width: 5, height: 3, color: 'white' });
 */
class Plane extends GameObject {
    /**
     * Creates a new Plane.
     * @param {Object} options - Configuration options (also accepts all GameObject options)
     * @param {number} [options.size=1] - Uniform size (used if width/height not specified)
     * @param {number} [options.width] - Width
     * @param {number} [options.height] - Height
     * @param {number} [options.widthSegments=1] - Width segments
     * @param {number} [options.heightSegments=1] - Height segments
     */
    constructor(options = {}) {
        super(options);
    }

    /** @override */
    createGeometry(options) {
        const {
            size = 1,
            width = size,
            height = size,
            widthSegments = 1,
            heightSegments = 1
        } = options;

        return new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    }
}

export { Plane };
