import React from 'react';
import './WaveDivider.css';

const WaveDivider = ({ position = 'top', color = '#ffffff', inverted = false }) => {
    const svgPath = inverted
        ? "M0,0 C300,100 400,200 512,100 C614,0 750,100 1200,50 L1200,0 L0,0 Z"
        : "M0,100 C300,0 400,100 512,50 C614,0 750,50 1200,0 L1200,100 L0,100 Z";

    return (
        <div className={`wave-divider ${position} ${inverted ? 'inverted' : ''}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
            >
                <path
                    d={svgPath}
                    fill={color}
                ></path>
            </svg>
        </div>
    );
};

export default WaveDivider; 