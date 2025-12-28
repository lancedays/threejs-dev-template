import * as THREE from 'three';
import { GameObject } from '../GameObject.js';

/**
 * Box - A simple box/cube primitive.
 *
 * @extends GameObject
 * @example
 * // Simple cube
 * new Box({ color: 'red', size: 2 });
 *
 * // Non-uniform box
 * new Box({ width: 2, height: 1, depth: 3, color: 'blue' });
 *
 * // With animation
 * new Box({ color: 'coral' }).spin();
 */
class Box extends GameObject {
    /**
     * Creates a new Box.
     * @param {Object} options - Configuration options (also accepts all GameObject options)
     * @param {number} [options.size=1] - Uniform size (used if width/height/depth not specified)
     * @param {number} [options.width] - Width (X axis)
     * @param {number} [options.height] - Height (Y axis)
     * @param {number} [options.depth] - Depth (Z axis)
     * @param {number} [options.widthSegments=1] - Width segments
     * @param {number} [options.heightSegments=1] - Height segments
     * @param {number} [options.depthSegments=1] - Depth segments
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * Creates the box geometry.
     * @override
     */
    createGeometry(options) {
        const {
            size = 1,
            width = size,
            height = size,
            depth = size,
            widthSegments = 1,
            heightSegments = 1,
            depthSegments = 1
        } = options;

        return new THREE.BoxGeometry(
            width,
            height,
            depth,
            widthSegments,
            heightSegments,
            depthSegments
        );
    }
}

export { Box };
