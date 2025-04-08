import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GetStarted.css';
import { useTranslation } from './context/TranslationContext';
import TranslatableText from './components/TranslatableText';
import { FaRecycle, FaMapMarkedAlt, FaRobot, FaUsers, FaChartLine, FaMedal } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ParticlesBackground from './components/ParticlesBackground';
import WaveDivider from './components/WaveDivider';
import CountUp from 'react-countup';

function GetStarted() {
    const navigate = useNavigate();
    const { translateText } = useTranslation();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false
        });
    }, []);

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="getstarted-page">
            <div className="hero-section">
                <div className="hero-content" data-aos="fade-up">
                    <h1>
                        <span className="highlight">Transforming</span> Waste Management with <br />
                        <span className="brand-name">BinGuardian AI</span>
                    </h1>
                    <p className="hero-subtitle">
                        <TranslatableText>
                            Empower your community with AI-Driven Waste Monitoring, Reporting, and Smart Recycling Solutions.
                        </TranslatableText>
                    </p>
                    <div className="hero-buttons">
                        <button className="primary-button" onClick={handleGetStarted}>
                            <TranslatableText>Get Started</TranslatableText>
                        </button>
                    </div>
                </div>
                <ParticlesBackground />
                <WaveDivider position="bottom" color="#ffffff" />
            </div>

            <div className="trusted-section">
                <div className="container">
                    <h2 data-aos="fade-up"><TranslatableText>Trusted by Growing Communities</TranslatableText></h2>
                    <div className="trust-logos">
                        {/* Placeholder for partner logos */}
                        <div className="logo-placeholder" data-aos="fade-up" data-aos-delay="100"></div>
                        <div className="logo-placeholder" data-aos="fade-up" data-aos-delay="200"></div>
                        <div className="logo-placeholder" data-aos="fade-up" data-aos-delay="300"></div>
                        <div className="logo-placeholder" data-aos="fade-up" data-aos-delay="400"></div>
                    </div>
                </div>
            </div>

            <div className="welcome-section">
                <div className="container">
                    <div className="welcome-content" data-aos="fade-right">
                        <h2><TranslatableText>Welcome to BinGuardian AI</TranslatableText></h2>
                        <p>
                            <TranslatableText>
                                At BinGuardian, we're redefining how communities and municipalities manage waste. Our mission is clear:
                                to help citizens report waste issues, engage in recycling, and contribute to environmental sustainability
                                with the smallest ecological footprint possible. With cutting-edge AI technology and innovative solutions,
                                we provide smart waste management that optimizes efficiency, reduces costs, and helps achieve sustainability goals.
                            </TranslatableText>
                        </p>
                    </div>
                    <div className="welcome-image" data-aos="fade-left">
                        <img
                            src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Sustainable waste management"
                            className="welcome-img"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1611284446313-468a41d27ef8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                            }}
                        />
                    </div>
                </div>
                <WaveDivider position="bottom" color="#f9f9f9" />
            </div>

            <div className="features-section">
                <div className="container">
                    <h2 data-aos="fade-up"><TranslatableText>Features You'll Unlock</TranslatableText></h2>

                    <div className="features-grid">
                        <div className="feature-card" data-aos="zoom-in" data-aos-delay="100">
                            <div className="feature-icon">
                                <FaMapMarkedAlt />
                            </div>
                            <h3><TranslatableText>Report Waste</TranslatableText></h3>
                            <p>
                                <TranslatableText>
                                    Report uncollected waste in your community with our easy-to-use map interface.
                                </TranslatableText>
                            </p>
                        </div>

                        <div className="feature-card" data-aos="zoom-in" data-aos-delay="200">
                            <div className="feature-icon">
                                <FaRecycle />
                            </div>
                            <h3><TranslatableText>Recycling & Awareness</TranslatableText></h3>
                            <p>
                                <TranslatableText>
                                    Learn about proper waste disposal and recycling techniques.
                                </TranslatableText>
                            </p>
                        </div>

                        <div className="feature-card" data-aos="zoom-in" data-aos-delay="300">
                            <div className="feature-icon">
                                <FaRobot />
                            </div>
                            <h3><TranslatableText>Ask BinBot</TranslatableText></h3>
                            <p>
                                <TranslatableText>
                                    Get answers to your waste management questions from our AI assistant.
                                </TranslatableText>
                            </p>
                        </div>

                        <div className="feature-card" data-aos="zoom-in" data-aos-delay="400">
                            <div className="feature-icon">
                                <FaChartLine />
                            </div>
                            <h3><TranslatableText>Track Progress</TranslatableText></h3>
                            <p>
                                <TranslatableText>
                                    Monitor your contributions and see the impact you're making.
                                </TranslatableText>
                            </p>
                        </div>

                        <div className="feature-card" data-aos="zoom-in" data-aos-delay="500">
                            <div className="feature-icon">
                                <FaMedal />
                            </div>
                            <h3><TranslatableText>Earn Rewards</TranslatableText></h3>
                            <p>
                                <TranslatableText>
                                    Earn points and achievements for your environmental efforts.
                                </TranslatableText>
                            </p>
                        </div>

                        <div className="feature-card" data-aos="zoom-in" data-aos-delay="600">
                            <div className="feature-icon">
                                <FaUsers />
                            </div>
                            <h3><TranslatableText>Join Community</TranslatableText></h3>
                            <p>
                                <TranslatableText>
                                    Be part of a community dedicated to cleaner neighborhoods.
                                </TranslatableText>
                            </p>
                        </div>
                    </div>
                </div>
                <WaveDivider position="bottom" color="#ffffff" />
            </div>

            <div className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item" data-aos="fade-up">
                            <div className="stat-number" id="counter-1">
                                <CountUp end={85} duration={2.5} />
                            </div>
                            <div className="stat-label">Reduction in unnecessary pickups</div>
                        </div>
                        <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
                            <div className="stat-number" id="counter-2">
                                <CountUp end={70} duration={2.5} />
                            </div>
                            <div className="stat-label">Increase in clean recycling</div>
                        </div>
                        <div className="stat-item" data-aos="fade-up" data-aos-delay="400">
                            <div className="stat-number" id="counter-3">
                                <CountUp end={5000} duration={3} separator="," />
                            </div>
                            <div className="stat-label">Communities served</div>
                        </div>
                    </div>
                </div>
                <WaveDivider position="bottom" color="rgba(0, 0, 0, 0.8)" />
            </div>

            <div className="cta-section" data-aos="fade-up">
                <div className="container">
                    <h2><TranslatableText>Ready to make a difference?</TranslatableText></h2>
                    <p>
                        <TranslatableText>
                            Join thousands of active citizens who are working together to keep our environment clean.
                        </TranslatableText>
                    </p>
                    <button className="primary-button" onClick={handleGetStarted}>
                        <TranslatableText>Sign Up Now</TranslatableText>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GetStarted; 