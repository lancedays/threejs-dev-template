import * as THREE from 'three';
import { GameObject } from '../GameObject.js';

/**
 * Sphere - A sphere primitive.
 *
 * @extends GameObject
 * @example
 * new Sphere({ color: 'blue', radius: 2 });
 * new Sphere({ color: 'coral' }).float();
 */
class Sphere extends GameObject {
    /**
     * Creates a new Sphere.
     * @param {Object} options - Configuration options (also accepts all GameObject options)
     * @param {number} [options.radius=1] - Sphere radius
     * @param {number} [options.widthSegments=32] - Horizontal segments
     * @param {number} [options.heightSegments=16] - Vertical segments
     */
    constructor(options = {}) {
        super(options);
    }

    /** @override */
    createGeometry(options) {
        const {
            radius = 1,
            widthSegments = 32,
            heightSegments = 16
        } = options;

        return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    }
}

export { Sphere };
