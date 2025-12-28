import * as THREE from 'three';
import { GameObject } from '../GameObject.js';

/**
 * Torus - A donut/ring shape primitive.
 *
 * @extends GameObject
 * @example
 * new Torus({ color: 'coral' }).spin();
 * new Torus({ radius: 2, tube: 0.5, color: 'gold' });
 */
class Torus extends GameObject {
    /**
     * Creates a new Torus.
     * @param {Object} options - Configuration options (also accepts all GameObject options)
     * @param {number} [options.radius=1] - Main radius (center to tube center)
     * @param {number} [options.tube=0.4] - Tube radius
     * @param {number} [options.radialSegments=16] - Radial segments
     * @param {number} [options.tubularSegments=48] - Tubular segments
     */
    constructor(options = {}) {
        super(options);
    }

    /** @override */
    createGeometry(options) {
        const {
            radius = 1,
            tube = 0.4,
            radialSegments = 16,
            tubularSegments = 48
        } = options;

        return new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    }
}

export { Torus };
