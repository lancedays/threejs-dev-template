import * as THREE from 'three';
import { GameObject } from '../GameObject.js';

/**
 * Cylinder - A cylinder primitive.
 *
 * @extends GameObject
 * @example
 * new Cylinder({ color: 'silver', radius: 0.5, height: 2 });
 *
 * // Cone (radiusTop = 0)
 * new Cylinder({ radiusTop: 0, radiusBottom: 1, height: 2, color: 'gold' });
 */
class Cylinder extends GameObject {
    /**
     * Creates a new Cylinder.
     * @param {Object} options - Configuration options (also accepts all GameObject options)
     * @param {number} [options.radius=1] - Uniform radius (used if radiusTop/radiusBottom not specified)
     * @param {number} [options.radiusTop] - Top radius
     * @param {number} [options.radiusBottom] - Bottom radius
     * @param {number} [options.height=1] - Height
     * @param {number} [options.radialSegments=32] - Radial segments
     * @param {number} [options.heightSegments=1] - Height segments
     * @param {boolean} [options.openEnded=false] - Open ended (no caps)
     */
    constructor(options = {}) {
        super(options);
    }

    /** @override */
    createGeometry(options) {
        const {
            radius = 1,
            radiusTop = radius,
            radiusBottom = radius,
            height = 1,
            radialSegments = 32,
            heightSegments = 1,
            openEnded = false
        } = options;

        return new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments,
            openEnded
        );
    }
}

export { Cylinder };
