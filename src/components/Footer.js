import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="copyright">All Rights Are Reserved © BINGUARDIAN.</p>
                <p className="developers">
                    Developed By{' '}
                    <a href="http://linkedin.com/in/mourya-s" target="_blank" rel="noopener noreferrer">
                        MOURYA S
                    </a>
                    ,{' '}
                    <a href="https://www.linkedin.com/in/bhanuprakash28/" target="_blank" rel="noopener noreferrer">
                        BHANUPRAKASH BM
                    </a>
                    {' '}And{' '}
                    <a href="https://www.linkedin.com/posts/akash-kumar-singh-9a0278322_sih-sih2024-innovation-activity-7274058947647401984-4-xs?utm_source=share&utm_medium=member_android&rcm=ACoAAFGNqogBMdMVC3vntrbhf6ZlcfKm_T5Y9jE" target="_blank" rel="noopener noreferrer">
                        AKASH KUMAR SINGH
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer; 