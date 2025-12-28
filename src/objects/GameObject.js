import * as THREE from 'three';
import { parseColor } from '../utils/colors.js';

/**
 * GameObject - Base class for all 3D objects in the scene.
 *
 * Provides a common interface for:
 * - Position, rotation, and scale
 * - Material and color management
 * - Lifecycle methods (update, dispose)
 * - Chainable API for fluent configuration
 *
 * @abstract
 * @example
 * class MyObject extends GameObject {
 *   createGeometry() {
 *     return new THREE.SphereGeometry(1);
 *   }
 * }
 */
class GameObject {
    /**
     * Creates a new GameObject.
     * @param {Object} options - Configuration options
     * @param {string} [options.name] - Name for finding the object later
     * @param {string|number} [options.color=0x4a90d9] - Object color
     * @param {number} [options.x=0] - X position
     * @param {number} [options.y=0] - Y position
     * @param {number} [options.z=0] - Z position
     * @param {number} [options.rotationX=0] - X rotation in degrees
     * @param {number} [options.rotationY=0] - Y rotation in degrees
     * @param {number} [options.rotationZ=0] - Z rotation in degrees
     * @param {number} [options.scale=1] - Uniform scale
     * @param {boolean} [options.wireframe=false] - Show as wireframe
     * @param {string} [options.materialType='standard'] - Material type: 'basic', 'standard', 'phong'
     */
    constructor(options = {}) {
        const {
            name = '',
            color = 0x4a90d9,
            x = 0,
            y = 0,
            z = 0,
            rotationX = 0,
            rotationY = 0,
            rotationZ = 0,
            scale = 1,
            wireframe = false,
            materialType = 'standard'
        } = options;

        this.name = name;
        this.options = options;

        // Create geometry (implemented by subclasses)
        const geometry = this.createGeometry(options);

        // Create material
        const material = this._createMaterial(color, wireframe, materialType);

        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.userData.gameObject = this; // Back-reference

        // Apply transforms
        this.setPosition(x, y, z);
        this.setRotation(rotationX, rotationY, rotationZ);
        this.setScale(scale);

        // Map of named animations (allows replacement) + array for custom updates
        this._animations = new Map();
        this._customUpdates = [];
    }

    /**
     * Creates the geometry for this object. Override in subclasses.
     * @abstract
     * @param {Object} options - The constructor options
     * @returns {THREE.BufferGeometry}
     */
    createGeometry(options) {
        throw new Error('GameObject.createGeometry() must be implemented by subclass');
    }

    /**
     * Creates the material based on type.
     * @private
     */
    _createMaterial(color, wireframe, materialType) {
        const parsedColor = parseColor(color);
        const materialOptions = { color: parsedColor, wireframe };

        switch (materialType) {
            case 'basic':
                return new THREE.MeshBasicMaterial(materialOptions);
            case 'phong':
                return new THREE.MeshPhongMaterial(materialOptions);
            case 'standard':
            default:
                return new THREE.MeshStandardMaterial(materialOptions);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Transform Methods (Chainable)
    // ─────────────────────────────────────────────────────────────────

    /**
     * Sets the position.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {GameObject} Returns this for chaining
     */
    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
        return this;
    }

    /**
     * Sets the rotation in degrees.
     * @param {number} x - Rotation around X axis in degrees
     * @param {number} y - Rotation around Y axis in degrees
     * @param {number} z - Rotation around Z axis in degrees
     * @returns {GameObject} Returns this for chaining
     */
    setRotation(x, y, z) {
        this.mesh.rotation.set(
            THREE.MathUtils.degToRad(x),
            THREE.MathUtils.degToRad(y),
            THREE.MathUtils.degToRad(z)
        );
        return this;
    }

    /**
     * Sets uniform scale.
     * @param {number} scale
     * @returns {GameObject} Returns this for chaining
     */
    setScale(scale) {
        this.mesh.scale.setScalar(scale);
        return this;
    }

    /**
     * Sets non-uniform scale.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {GameObject} Returns this for chaining
     */
    setScaleXYZ(x, y, z) {
        this.mesh.scale.set(x, y, z);
        return this;
    }

    // ─────────────────────────────────────────────────────────────────
    // Appearance Methods (Chainable)
    // ─────────────────────────────────────────────────────────────────

    /**
     * Sets the color.
     * @param {string|number} color
     * @returns {GameObject} Returns this for chaining
     */
    setColor(color) {
        this.mesh.material.color.set(parseColor(color));
        return this;
    }

    /**
     * Sets visibility.
     * @param {boolean} visible
     * @returns {GameObject} Returns this for chaining
     */
    setVisible(visible) {
        this.mesh.visible = visible;
        return this;
    }

    // ─────────────────────────────────────────────────────────────────
    // Animation Methods
    // ─────────────────────────────────────────────────────────────────

    /**
     * Adds a custom update function called every frame.
     * Multiple update functions can be added and will all run.
     * @param {Function} fn - Function receiving (gameObject, delta, elapsed)
     * @returns {GameObject} Returns this for chaining
     *
     * @example
     * box.onUpdate((obj, delta, elapsed) => {
     *   obj.mesh.rotation.y += delta;
     * });
     */
    onUpdate(fn) {
        this._customUpdates.push(fn);
        return this;
    }

    /**
     * Adds or replaces a named animation.
     * @param {string} name - Animation name (used for replacement)
     * @param {Function} fn - Update function
     * @returns {GameObject} Returns this for chaining
     * @private
     */
    _setAnimation(name, fn) {
        this._animations.set(name, fn);
        return this;
    }

    /**
     * Removes a named animation.
     * @param {string} name - Animation name to remove
     * @returns {GameObject} Returns this for chaining
     */
    stopAnimation(name) {
        this._animations.delete(name);
        return this;
    }

    /**
     * Called every frame by the Scene.
     * @param {number} delta - Time since last frame
     * @param {number} elapsed - Total elapsed time
     */
    update(delta, elapsed) {
        // Run named animations
        for (const fn of this._animations.values()) {
            fn(this, delta, elapsed);
        }
        // Run custom updates
        for (const fn of this._customUpdates) {
            fn(this, delta, elapsed);
        }
    }

    /**
     * Removes all animations and custom updates.
     * @returns {GameObject} Returns this for chaining
     */
    clearAnimations() {
        this._animations.clear();
        this._customUpdates = [];
        return this;
    }

    // ─────────────────────────────────────────────────────────────────
    // Built-in Animations (Chainable)
    // ─────────────────────────────────────────────────────────────────

    /**
     * Makes the object spin continuously. Calling again replaces the previous spin.
     * @param {Object} options - Spin options
     * @param {number} [options.speedX=0] - Rotation speed around X axis
     * @param {number} [options.speedY=1] - Rotation speed around Y axis
     * @param {number} [options.speedZ=0] - Rotation speed around Z axis
     * @returns {GameObject} Returns this for chaining
     */
    spin({ speedX = 0, speedY = 1, speedZ = 0 } = {}) {
        this._setAnimation('spin', (obj, delta) => {
            obj.mesh.rotation.x += speedX * delta;
            obj.mesh.rotation.y += speedY * delta;
            obj.mesh.rotation.z += speedZ * delta;
        });
        return this;
    }

    /**
     * Makes the object float up and down. Calling again replaces the previous float.
     * @param {Object} options - Float options
     * @param {number} [options.amplitude=0.5] - Height of float
     * @param {number} [options.speed=1] - Speed of float
     * @returns {GameObject} Returns this for chaining
     */
    float({ amplitude = 0.5, speed = 1 } = {}) {
        const startY = this.mesh.position.y;
        this._setAnimation('float', (obj, delta, elapsed) => {
            obj.mesh.position.y = startY + Math.sin(elapsed * speed) * amplitude;
        });
        return this;
    }

    // ─────────────────────────────────────────────────────────────────
    // Utility Methods
    // ─────────────────────────────────────────────────────────────────

    /**
     * Gets the underlying Three.js mesh.
     * @returns {THREE.Mesh}
     */
    getMesh() {
        return this.mesh;
    }

    /**
     * Cleans up geometry and material.
     */
    dispose() {
        this.mesh.geometry.dispose();
        if (Array.isArray(this.mesh.material)) {
            this.mesh.material.forEach(m => m.dispose());
        } else {
            this.mesh.material.dispose();
        }
    }
}

export { GameObject };
