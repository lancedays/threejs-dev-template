import * as THREE from 'three';

/**
 * Scene - Container for the Three.js scene, camera, and lighting.
 *
 * Responsibilities:
 * - Scene graph management
 * - Camera setup and configuration
 * - Default lighting setup
 * - Managing GameObjects
 *
 * @example
 * const scene = new Scene({ background: '#1a1a2e' });
 * scene.add(new Box({ color: 'red' }));
 */
class Scene {
    /**
     * Creates a new Scene instance.
     * @param {Object} options - Configuration options
     * @param {string|number} [options.background=0x0a0a1f] - Background color
     * @param {number} [options.fov=75] - Camera field of view
     * @param {number} [options.near=0.1] - Camera near clipping plane
     * @param {number} [options.far=1000] - Camera far clipping plane
     * @param {Object} [options.cameraPosition={x:0, y:0, z:5}] - Initial camera position
     * @param {boolean} [options.defaultLighting=true] - Add default lights
     */
    constructor(options = {}) {
        const {
            background = 0x0a0a1f,
            fov = 75,
            near = 0.1,
            far = 1000,
            cameraPosition = { x: 0, y: 0, z: 5 },
            defaultLighting = true
        } = options;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(background);

        this.camera = this._createCamera(fov, near, far, cameraPosition);
        this.gameObjects = [];

        if (defaultLighting) {
            this._setupDefaultLighting();
        }
    }

    /**
     * Creates and configures the camera.
     * @private
     */
    _createCamera(fov, near, far, position) {
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(position.x, position.y, position.z);
        return camera;
    }

    /**
     * Sets up default lighting (ambient + directional).
     * @private
     */
    _setupDefaultLighting() {
        // Soft ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light for shadows and depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);
    }

    /**
     * Adds a GameObject or Three.js Object3D to the scene.
     * @param {GameObject|THREE.Object3D} object - The object to add
     * @returns {Scene} Returns this for chaining
     */
    add(object) {
        if (object.mesh) {
            // It's a GameObject
            this.gameObjects.push(object);
            this.scene.add(object.mesh);
        } else if (object instanceof THREE.Object3D) {
            // It's a raw Three.js object
            this.scene.add(object);
        }
        return this;
    }

    /**
     * Removes a GameObject or Three.js Object3D from the scene.
     * @param {GameObject|THREE.Object3D} object - The object to remove
     * @returns {Scene} Returns this for chaining
     */
    remove(object) {
        if (object.mesh) {
            const index = this.gameObjects.indexOf(object);
            if (index > -1) {
                this.gameObjects.splice(index, 1);
            }
            this.scene.remove(object.mesh);
        } else if (object instanceof THREE.Object3D) {
            this.scene.remove(object);
        }
        return this;
    }

    /**
     * Called every frame to update all GameObjects.
     * @param {number} delta - Time since last frame in seconds
     * @param {number} elapsed - Total elapsed time in seconds
     */
    update(delta, elapsed) {
        for (const gameObject of this.gameObjects) {
            if (gameObject.update) {
                gameObject.update(delta, elapsed);
            }
        }
    }

    /**
     * Handles window resize.
     * @param {number} width - New width
     * @param {number} height - New height
     */
    handleResize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Gets the underlying Three.js scene.
     * @returns {THREE.Scene}
     */
    getScene() {
        return this.scene;
    }

    /**
     * Gets the camera.
     * @returns {THREE.PerspectiveCamera}
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Finds a GameObject by name.
     * @param {string} name - The name to search for
     * @returns {GameObject|undefined}
     */
    findByName(name) {
        return this.gameObjects.find(obj => obj.name === name);
    }

    /**
     * Cleans up all resources.
     */
    dispose() {
        for (const gameObject of this.gameObjects) {
            if (gameObject.dispose) {
                gameObject.dispose();
            }
        }
        this.gameObjects = [];
    }
}

export { Scene };
