import React, { useEffect } from 'react';
import './ParticlesBackground.css';

function ParticlesBackground() {
    useEffect(() => {
        const particlesContainer = document.querySelector('.particles-animation');

        if (!particlesContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;

            // Random size
            const size = Math.random() * 15 + 5;

            // Random opacity
            const opacity = Math.random() * 0.5 + 0.1;

            // Random animation duration
            const duration = Math.random() * 15 + 10;

            // Apply styles
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;

            particlesContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        };

        // Initial particles
        for (let i = 0; i < 20; i++) {
            createParticle();
        }

        // Create new particles periodically
        const interval = setInterval(() => {
            createParticle();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <div className="particles-animation"></div>;
}

export default ParticlesBackground; 