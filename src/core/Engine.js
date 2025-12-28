import * as THREE from 'three';

/**
 * Engine - The core rendering engine that manages the WebGL renderer and animation loop.
 *
 * Responsibilities:
 * - WebGL renderer creation and configuration
 * - Animation loop management
 * - Window resize handling
 *
 * @example
 * const engine = new Engine();
 * engine.run(scene);
 */
class Engine {
    /**
     * Creates a new Engine instance.
     * @param {Object} options - Configuration options
     * @param {HTMLElement} [options.container=document.body] - DOM element to attach the renderer
     * @param {boolean} [options.antialias=true] - Enable antialiasing
     * @param {number} [options.pixelRatio=window.devicePixelRatio] - Pixel ratio for rendering
     */
    constructor(options = {}) {
        const {
            container = document.body,
            antialias = true,
            pixelRatio = window.devicePixelRatio
        } = options;

        this.container = container;
        this.renderer = this._createRenderer(antialias, pixelRatio);
        this.clock = new THREE.Clock();
        this.isRunning = false;
        this.activeScene = null;

        this._bindEvents();
        this._appendToDOM();
    }

    /**
     * Creates and configures the WebGL renderer.
     * @private
     */
    _createRenderer(antialias, pixelRatio) {
        const renderer = new THREE.WebGLRenderer({ antialias });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(pixelRatio);
        return renderer;
    }

    /**
     * Binds window events.
     * @private
     */
    _bindEvents() {
        window.addEventListener('resize', this._onResize.bind(this));
    }

    /**
     * Handles window resize.
     * @private
     */
    _onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width, height);

        if (this.activeScene) {
            this.activeScene.handleResize(width, height);
        }
    }

    /**
     * Appends renderer to DOM.
     * @private
     */
    _appendToDOM() {
        this.container.appendChild(this.renderer.domElement);
    }

    /**
     * Starts the render loop with the given scene.
     * @param {Scene} scene - The scene to render
     */
    run(scene) {
        this.activeScene = scene;
        this.isRunning = true;
        this._animate();
    }

    /**
     * Stops the render loop.
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Main animation loop.
     * @private
     */
    _animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(this._animate.bind(this));

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        if (this.activeScene) {
            this.activeScene.update(delta, elapsed);
            this.renderer.render(this.activeScene.scene, this.activeScene.camera);
        }
    }

    /**
     * Gets the WebGL renderer instance.
     * @returns {THREE.WebGLRenderer}
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * Cleans up resources.
     */
    dispose() {
        this.stop();
        window.removeEventListener('resize', this._onResize);
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}

export { Engine };
