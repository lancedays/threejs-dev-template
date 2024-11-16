import * as THREE from 'three';

class ThreeScene {
    constructor() {
        this.initScene();
        this.setupEventListeners();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1f);
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

class ColorCube extends ThreeScene {
    constructor() {
        super();
        this.createCube();
        this.animate();
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }), // red
            new THREE.MeshBasicMaterial({ color: 0xff8c00 }), // orange
            new THREE.MeshBasicMaterial({ color: 0xffff00 }), // yellow
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // green
            new THREE.MeshBasicMaterial({ color: 0x0000ff }), // blue
            new THREE.MeshBasicMaterial({ color: 0x4b0082 }), // indigo
        ];

        this.cube = new THREE.Mesh(geometry, materials);
        this.scene.add(this.cube);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Rotate cube
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.render();
    }
}

// Start the application
function main() {
    new ColorCube();
}

main();