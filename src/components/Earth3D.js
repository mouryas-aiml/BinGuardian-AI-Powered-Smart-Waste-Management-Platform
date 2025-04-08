import React, { useEffect } from 'react';
import './Earth3D.css';

const Earth3D = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                initEarth();
            };

            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                // Clean up any animation frames or event listeners
                window.cancelAnimationFrame(window.earthAnimationFrame);
            };
        }
    }, []);

    const initEarth = () => {
        const THREE = window.THREE;
        if (!THREE) return;

        const container = document.getElementById('earth-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create Earth sphere
        const geometry = new THREE.SphereGeometry(5, 64, 64);

        // Load Earth texture
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load(
            'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            () => {
                earthTexture.wrapS = THREE.RepeatWrapping;
                earthTexture.wrapT = THREE.RepeatWrapping;
            }
        );

        const material = new THREE.MeshBasicMaterial({
            map: earthTexture,
        });

        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        camera.position.z = 12;

        // Add subtle ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Handle window resize
        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // Animation
        const animate = () => {
            window.earthAnimationFrame = requestAnimationFrame(animate);

            earth.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        animate();
    };

    return <div id="earth-container" className="earth-container"></div>;
};

export default Earth3D; 