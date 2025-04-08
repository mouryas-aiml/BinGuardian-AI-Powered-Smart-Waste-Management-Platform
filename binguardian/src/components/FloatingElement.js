import React from 'react';
import './FloatingElement.css';

const FloatingElement = ({ children, speed = 'medium', delay = 0, className = '' }) => {
    const speedClass = {
        slow: 'float-slow',
        medium: 'float-medium',
        fast: 'float-fast'
    }[speed] || 'float-medium';

    const style = {
        animationDelay: `${delay}s`
    };

    return (
        <div className={`floating-element ${speedClass} ${className}`} style={style}>
            {children}
        </div>
    );
};

export default FloatingElement; 