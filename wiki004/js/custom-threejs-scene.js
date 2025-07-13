// js/custom-threejs-scene.js

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.165.0/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.165.0/examples/jsm/controls/OrbitControls.js';
// Uncomment if you are loading GLTF models
// import { GLTFLoader } from 'https://unpkg.com/three@0.165.0/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    const canvas = document.getElementById('threejs-canvas');
    const overlay = document.querySelector('.threejs-overlay'); // Get the overlay element

    if (!container || !canvas) {
        console.warn("Three.js container or canvas not found. Skipping 3D initialization.");
        return;
    }

    let scene, camera, renderer, controls, mainObject;
    let scrollProgress = 0; // Tracks scroll depth for animation
    let animationFrameId; // To store requestAnimationFrame ID for cleanup

    function initThreeJS() {
        // Scene Setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Pure black background
        scene.fog = new THREE.Fog(0x000000, 10, 50); // Adds depth effect

        // Camera Setup
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 15); // Initial camera position, far back
        camera.lookAt(0, 0, 0);

        // Renderer Setup
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding; // For better color fidelity

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.7); // Soft ambient light
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-5, -5, -5);
        scene.add(directionalLight2);

        // --- Add your 3D Models Here ---
        // For a simple placeholder (e.g., DNA helix, abstract TimeEraser icon)
        // Example: A complex, abstract shape using BufferGeometry
        const geometry = new THREE.DodecahedronGeometry(3, 0); // Larger, more complex shape
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xFDD835, // Yellow from palette
            metalness: 0.8,
            roughness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.2
        });
        mainObject = new THREE.Mesh(geometry, material);
        scene.add(mainObject);

        // If loading GLTF models:
        // const loader = new GLTFLoader();
        // loader.load('assets/models/timeraser-device.gltf', (gltf) => {
        //     mainObject = gltf.scene;
        //     scene.add(mainObject);
        //     mainObject.scale.set(5, 5, 5); // Adjust scale as needed
        //     mainObject.position.set(0, 0, 0); // Adjust position as needed
        //     console.log('GLTF Model loaded:', mainObject);
        // }, undefined, (error) => {
        //     console.error('An error occurred while loading the GLTF model:', error);
        //     // Fallback to basic shape or show error message
        // });


        // Orbit Controls for mouse interaction
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // For smoother movement
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false; // Restrict panning
        controls.minDistance = 2; // Closest zoom
        controls.maxDistance = 20; // Furthest zoom
        controls.autoRotate = false; // Disable auto-rotation initially
        controls.enablePan = false; // Disable panning to focus on rotation/zoom


        // Resize Listener
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // Auto-rotate the object slightly when not interacted with
        if (mainObject && !controls.hasUserInteracted) { // 'hasUserInteracted' isn't standard, would need custom tracking
            mainObject.rotation.x += 0.001;
            mainObject.rotation.y += 0.002;
        }

        controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
        renderer.render(scene, camera);
    }

    // --- Scroll-triggered "Dive Into" Animation ---
    function handleScroll() {
        const viewportHeight = window.innerHeight;
        const containerRect = container.getBoundingClientRect();

        // Calculate how much of the container is visible on screen
        // Scroll progress from 0 (container fully below viewport) to 1 (container fully above viewport)
        const startScroll = containerRect.top + containerRect.height; // When bottom of container is at top of viewport
        const endScroll = containerRect.bottom; // When top of container is at bottom of viewport

        // Normalize scroll to a 0-1 range within the influence zone
        const scrollRange = (container.clientHeight + viewportHeight); // Total scrollable range for animation
        const currentScroll = window.scrollY - (container.offsetTop - viewportHeight); // How far we've scrolled into its zone

        scrollProgress = Math.max(0, Math.min(1, currentScroll / scrollRange));

        // --- Animate Camera Position / Object Position based on scrollProgress ---
        // This creates the "dive into" effect
        if (camera) {
            // Camera Z-position: moves from 15 (far) to 5 (closer) as you scroll down
            camera.position.z = 15 - (scrollProgress * 10);
            // Camera Y-position: slight downward movement
            camera.position.y = 0 - (scrollProgress * 2);

            // Hide overlay text as user scrolls in
            if (overlay) {
                overlay.style.opacity = Math.max(0, 0.7 - scrollProgress * 1.5); // Fade out faster
            }

            // Adjust fog density (optional, adds depth)
            if (scene.fog) {
                scene.fog.near = 10 - (scrollProgress * 8); // Fog starts closer
                scene.fog.far = 50 - (scrollProgress * 20); // Fog ends closer
            }
        }

        // --- Trigger animations on mainObject as well ---
        if (mainObject) {
            // Example: Make object scale down slightly as you "dive"
            const scaleFactor = 1 - (scrollProgress * 0.2); // Scales from 1 to 0.8
            mainObject.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Example: Increase rotation speed as you scroll deeper
            mainObject.rotation.x += 0.001 + (scrollProgress * 0.005);
            mainObject.rotation.y += 0.002 + (scrollProgress * 0.01);
        }
    }

    // Initialize
    initThreeJS();
    animate(); // Start the animation loop
    window.addEventListener('scroll', handleScroll); // Attach scroll listener

    // Add event listeners for controls interaction detection
    // This is a simplified way to detect user interaction for auto-rotate
    let lastInteractionTime = Date.now();
    controls.addEventListener('start', () => {
        lastInteractionTime = Date.now();
        controls.autoRotate = false; // Disable auto-rotate when user starts interacting
    });
    controls.addEventListener('end', () => {
        lastInteractionTime = Date.now();
        // You might re-enable autoRotate after a short delay if no further interaction
        setTimeout(() => {
            if (Date.now() - lastInteractionTime > 2000) { // If no interaction for 2 seconds
                controls.autoRotate = false; // Keep it off, manual rotation is more direct
            }
        }, 2000);
    });
});