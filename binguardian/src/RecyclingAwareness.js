import React, { useState } from 'react';
import './RecyclingAwareness.css';
import { FaRecycle, FaLeaf, FaTrash, FaWater, FaBatteryFull, FaApple, FaPrint } from 'react-icons/fa';
import { useTranslation } from './context/TranslationContext';
import TranslateButton from './components/TranslateButton';

const TranslatableText = ({ children }) => {
    const { translateText } = useTranslation();
    return <>{translateText(children)}</>;
};

const SpeakButton = ({ text }) => {
    const { speakInLanguage } = useTranslation();

    const handleSpeak = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        speakInLanguage(text);
    };

    return (
        <button className="speak-button" onClick={handleSpeak}>
            <i className="fas fa-volume-up"></i> Listen
        </button>
    );
};

function RecyclingAwareness() {
    const { translateText, speakInLanguage } = useTranslation();
    const [activeTab, setActiveTab] = useState('general');
    const [activeMaterial, setActiveMaterial] = useState(null);
    const [expandedStep, setExpandedStep] = useState(null);

    const materials = [
        {
            id: 'paper',
            name: 'Paper & Cardboard',
            icon: <FaRecycle />,
            color: '#4285F4',
            examples: ['Newspapers', 'Magazines', 'Cardboard boxes', 'Office paper', 'Envelopes'],
            instructions: 'Remove any plastic windows from envelopes. Break down cardboard boxes. Keep paper dry and clean.',
            dos: ['Flatten cardboard boxes', 'Remove plastic packaging', 'Keep paper clean and dry'],
            donts: ['Don\'t recycle paper towels', 'Don\'t include greasy pizza boxes', 'Don\'t include waxed paper'],
            impact: 'Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and 3 cubic yards of landfill space.'
        },
        {
            id: 'plastic',
            name: 'Plastic',
            icon: <FaWater />,
            color: '#EA4335',
            examples: ['Plastic bottles', 'Food containers', 'Milk jugs', 'Detergent bottles', 'Plastic bags (in some areas)'],
            instructions: 'Rinse containers. Remove caps. Check bottom of containers for recycling number.',
            dos: ['Rinse containers', 'Crush bottles to save space', 'Check local regulations for accepted types'],
            donts: ['Don\'t include plastic with food residue', 'Don\'t include plastic wrap', 'Don\'t include styrofoam'],
            impact: 'Recycling plastic reduces oil consumption, as plastic is made from petroleum products. One recycled plastic bottle saves enough energy to power a 60-watt light bulb for 6 hours.'
        },
        {
            id: 'glass',
            name: 'Glass',
            icon: <FaWater />,
            color: '#34A853',
            examples: ['Glass bottles', 'Glass jars', 'Glass containers'],
            instructions: 'Rinse glass containers. Remove lids and caps. Sort by color if required by your local recycling program.',
            dos: ['Rinse thoroughly', 'Remove lids and caps', 'Keep separated from broken glass'],
            donts: ['Don\'t include window glass', 'Don\'t include drinking glasses', 'Don\'t include ceramic or porcelain'],
            impact: 'Glass can be recycled indefinitely without loss in quality or purity. Recycling one glass bottle saves enough energy to light a 100-watt bulb for 4 hours.'
        },
        {
            id: 'metal',
            name: 'Metal',
            icon: <FaRecycle />,
            color: '#FBBC05',
            examples: ['Aluminum cans', 'Steel cans', 'Clean foil', 'Metal lids', 'Aerosol cans (empty)'],
            instructions: 'Rinse all containers. Remove paper labels when possible. Crush cans to save space.',
            dos: ['Rinse cans', 'Remove food residue', 'Separate different metals if required'],
            donts: ['Don\'t include paint cans', 'Don\'t include containers with hazardous waste', 'Don\'t include pressurized containers'],
            impact: 'Recycling aluminum uses 95% less energy than making it from raw materials. A recycled aluminum can returns to the shelf as a new can in as little as 60 days.'
        },
        {
            id: 'electronic',
            name: 'Electronic Waste',
            icon: <FaBatteryFull />,
            color: '#8E44AD',
            examples: ['Computers', 'Phones', 'Tablets', 'Batteries', 'Printers', 'Cables'],
            instructions: 'Never throw electronics in regular trash. Find local e-waste recycling centers or retailer take-back programs.',
            dos: ['Back up and erase personal data', 'Remove batteries if possible', 'Take to designated e-waste centers'],
            donts: ['Don\'t throw in regular trash', 'Don\'t break displays which may contain hazardous materials', 'Don\'t disassemble unless knowledgeable'],
            impact: 'E-waste contains valuable materials like gold, silver, and copper that can be recovered. It also contains toxic materials that can harm the environment if improperly disposed of.'
        },
        {
            id: 'organic',
            name: 'Organic Waste',
            icon: <FaApple />,
            color: '#009688',
            examples: ['Fruit and vegetable scraps', 'Coffee grounds', 'Eggshells', 'Yard trimmings', 'Leaves'],
            instructions: 'Compost organic waste to create nutrient-rich soil. Keep meat, dairy, and oils out of home compost bins.',
            dos: ['Mix green (nitrogen-rich) and brown (carbon-rich) materials', 'Keep compost moist but not wet', 'Turn compost regularly'],
            donts: ['Don\'t include meat or dairy in home compost', 'Don\'t include pet waste', 'Don\'t let compost get too wet or dry'],
            impact: 'Composting reduces methane emissions from landfills and creates nutrient-rich soil amendment. About 30% of what we throw away could be composted.'
        }
    ];

    const recyclingTips = [
        {
            title: "Preparation is Key",
            description: "Always rinse containers before recycling and remove food residue. Contaminated items can cause entire batches of recyclables to be rejected."
        },
        {
            title: "Check Local Guidelines",
            description: "Recycling rules vary by location. What's recyclable in one city might not be in another. Check your local waste management website for specific guidelines."
        },
        {
            title: "Reduce and Reuse First",
            description: "Remember the waste hierarchy: Reduce, Reuse, Recycle. The best way to reduce waste is to avoid creating it in the first place."
        },
        {
            title: "Know the Symbols",
            description: "Learn to recognize recycling symbols on packaging. The number inside the triangular recycling symbol indicates the type of plastic used."
        },
        {
            title: "Avoid Wishcycling",
            description: "Don't put items in recycling just hoping they'll be recycled. 'Wishcycling' contaminates recycling streams and can do more harm than good."
        }
    ];

    const wasteReductionSteps = [
        {
            title: "Use Reusable Bags",
            description: "Keep reusable shopping bags in your car or by the door so you'll remember to take them to the store."
        },
        {
            title: "Buy in Bulk",
            description: "Purchase frequently used items in bulk to reduce packaging waste. Bring your own containers when possible."
        },
        {
            title: "Choose Minimal Packaging",
            description: "Select products with minimal packaging or packaging made from recycled materials."
        },
        {
            title: "Repair, Don't Replace",
            description: "Fix broken items instead of throwing them away. Many communities have repair cafes or tool libraries."
        },
        {
            title: "Go Paperless",
            description: "Sign up for digital bills, statements, and receipts to reduce paper waste at home and in the office."
        }
    ];

    return (
        <div className="recycling-awareness-container">
            <TranslateButton />
            <div className="recycling-banner">
                <div className="banner-content">
                    <h1>
                        <TranslatableText>Recycling & Waste Awareness</TranslatableText>
                        <SpeakButton text="Recycling & Waste Awareness" />
                    </h1>
                    <p>
                        <TranslatableText>
                            Learn how to properly recycle and reduce waste to help create a sustainable future.
                        </TranslatableText>
                        <SpeakButton text="Learn how to properly recycle and reduce waste to help create a sustainable future." />
                    </p>
                </div>
            </div>

            <div className="recycling-tabs">
                <button
                    className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <TranslatableText>Recycling Guide</TranslatableText>
                </button>
                <button
                    className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('materials')}
                >
                    <TranslatableText>Materials Guide</TranslatableText>
                </button>
                <button
                    className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tips')}
                >
                    <TranslatableText>Tips & Tricks</TranslatableText>
                </button>
                <button
                    className={`tab-button ${activeTab === 'reduce' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reduce')}
                >
                    <TranslatableText>Waste Reduction</TranslatableText>
                </button>
            </div>

            <div className="recycling-content">
                {activeTab === 'general' && (
                    <div className="general-guide">
                        <h2>
                            <TranslatableText>Recycling Basics</TranslatableText>
                            <SpeakButton text="Recycling Basics" />
                        </h2>

                        <div className="recycling-process">
                            <h3>
                                <TranslatableText>The Recycling Process</TranslatableText>
                                <SpeakButton text="The Recycling Process" />
                            </h3>
                            <div className="process-steps">
                                <div
                                    className={`process-step ${expandedStep === 'collection' ? 'expanded' : ''}`}
                                    onClick={() => setExpandedStep(expandedStep === 'collection' ? null : 'collection')}
                                >
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h4><TranslatableText>Collection</TranslatableText></h4>
                                        <p>
                                            <TranslatableText>
                                                Recyclables are collected from homes, businesses, and drop-off centers.
                                            </TranslatableText>
                                            <SpeakButton text="Recyclables are collected from homes, businesses, and drop-off centers." />
                                        </p>
                                    </div>

                                    {expandedStep === 'collection' && (
                                        <div className="step-details">
                                            <h5><TranslatableText>Collection Guide</TranslatableText></h5>
                                            <p>
                                                <TranslatableText>
                                                    Recycling collection involves several key practices for optimal results. Start by rinsing containers thoroughly to remove all food residue, as contaminated items can cause entire batches to be rejected. Remove caps and lids from bottles and jars, flatten cardboard boxes to save space, and always keep paper products dry and clean. For curbside collection, place recyclables in your designated bins according to local guidelines, following your area's collection schedule closely. Position bins with handles facing the street for easier collection. If using community collection centers, sort your recyclables according to the center's requirements before arrival and follow the posted signage for proper disposal. Many areas offer specialized collection points for items like glass, electronics, and hazardous waste that may not be accepted in regular recycling streams. Remember that preparing your materials properly increases the efficiency of the recycling process and helps ensure that more waste actually gets recycled rather than sent to landfills.
                                                </TranslatableText>
                                            </p>
                                            <SpeakButton text="Recycling collection involves several key practices for optimal results. Start by rinsing containers thoroughly to remove all food residue, as contaminated items can cause entire batches to be rejected. Remove caps and lids from bottles and jars, flatten cardboard boxes to save space, and always keep paper products dry and clean. For curbside collection, place recyclables in your designated bins according to local guidelines, following your area's collection schedule closely. Position bins with handles facing the street for easier collection. If using community collection centers, sort your recyclables according to the center's requirements before arrival and follow the posted signage for proper disposal. Many areas offer specialized collection points for items like glass, electronics, and hazardous waste that may not be accepted in regular recycling streams. Remember that preparing your materials properly increases the efficiency of the recycling process and helps ensure that more waste actually gets recycled rather than sent to landfills." />
                                        </div>
                                    )}
                                </div>

                                <div className="process-step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h4><TranslatableText>Sorting</TranslatableText></h4>
                                        <p>
                                            <TranslatableText>
                                                Materials are sorted by type at recycling facilities using both manual and automated processes.
                                            </TranslatableText>
                                            <SpeakButton text="Materials are sorted by type at recycling facilities using both manual and automated processes." />
                                        </p>
                                    </div>
                                </div>

                                <div className="process-step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h4><TranslatableText>Processing</TranslatableText></h4>
                                        <p>
                                            <TranslatableText>
                                                Sorted materials are cleaned, shredded, melted, or otherwise processed into raw materials.
                                            </TranslatableText>
                                            <SpeakButton text="Sorted materials are cleaned, shredded, melted, or otherwise processed into raw materials." />
                                        </p>
                                    </div>
                                </div>

                                <div className="process-step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h4><TranslatableText>Manufacturing</TranslatableText></h4>
                                        <p>
                                            <TranslatableText>
                                                Processed materials are used to create new products, completing the recycling loop.
                                            </TranslatableText>
                                            <SpeakButton text="Processed materials are used to create new products, completing the recycling loop." />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="recycling-benefits">
                            <h3>
                                <TranslatableText>Benefits of Recycling</TranslatableText>
                                <SpeakButton text="Benefits of Recycling" />
                            </h3>
                            <div className="benefits-grid">
                                <div className="benefit-card">
                                    <FaLeaf className="benefit-icon" />
                                    <h4><TranslatableText>Environmental Impact</TranslatableText></h4>
                                    <p>
                                        <TranslatableText>
                                            Reduces landfill use, conserves natural resources, and reduces pollution from extraction and manufacturing.
                                        </TranslatableText>
                                        <SpeakButton text="Reduces landfill use, conserves natural resources, and reduces pollution from extraction and manufacturing." />
                                    </p>
                                </div>
                                <div className="benefit-card">
                                    <FaRecycle className="benefit-icon" />
                                    <h4><TranslatableText>Resource Conservation</TranslatableText></h4>
                                    <p>
                                        <TranslatableText>
                                            Saves energy, water, and raw materials by reusing existing materials instead of extracting new ones.
                                        </TranslatableText>
                                        <SpeakButton text="Saves energy, water, and raw materials by reusing existing materials instead of extracting new ones." />
                                    </p>
                                </div>
                                <div className="benefit-card">
                                    <FaTrash className="benefit-icon" />
                                    <h4><TranslatableText>Waste Reduction</TranslatableText></h4>
                                    <p>
                                        <TranslatableText>
                                            Diverts materials from landfills, reducing methane emissions and extending landfill lifespans.
                                        </TranslatableText>
                                        <SpeakButton text="Diverts materials from landfills, reducing methane emissions and extending landfill lifespans." />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'materials' && (
                    <div className="materials-guide">
                        <h2>
                            <TranslatableText>Recycling Materials Guide</TranslatableText>
                            <SpeakButton text="Recycling Materials Guide" />
                        </h2>
                        <p className="guide-intro">
                            <TranslatableText>
                                Click on each material to learn how to properly prepare and recycle it.
                            </TranslatableText>
                            <SpeakButton text="Click on each material to learn how to properly prepare and recycle it." />
                        </p>

                        <div className="materials-grid">
                            {materials.map(material => (
                                <div
                                    key={material.id}
                                    className={`material-card ${activeMaterial === material.id ? 'active' : ''}`}
                                    style={{ backgroundColor: activeMaterial === material.id ? material.color : 'white' }}
                                    onClick={() => setActiveMaterial(activeMaterial === material.id ? null : material.id)}
                                >
                                    <div className="material-icon" style={{ color: material.color }}>
                                        {material.icon}
                                    </div>
                                    <h3 className={activeMaterial === material.id ? 'text-white' : ''}>
                                        <TranslatableText>{material.name}</TranslatableText>
                                    </h3>
                                    {activeMaterial === material.id && (
                                        <div className="material-details">
                                            <div className="material-section">
                                                <h4><TranslatableText>Common Examples</TranslatableText></h4>
                                                <ul>
                                                    {material.examples.map((example, idx) => (
                                                        <li key={idx}>
                                                            <TranslatableText>{example}</TranslatableText>
                                                            <SpeakButton text={example} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="material-section">
                                                <h4><TranslatableText>How to Recycle</TranslatableText></h4>
                                                <p>
                                                    <TranslatableText>{material.instructions}</TranslatableText>
                                                    <SpeakButton text={material.instructions} />
                                                </p>
                                            </div>

                                            <div className="material-dos-donts">
                                                <div className="material-dos">
                                                    <h4><TranslatableText>Do's</TranslatableText></h4>
                                                    <ul>
                                                        {material.dos.map((item, idx) => (
                                                            <li key={idx}>
                                                                <TranslatableText>{item}</TranslatableText>
                                                                <SpeakButton text={item} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="material-donts">
                                                    <h4><TranslatableText>Don'ts</TranslatableText></h4>
                                                    <ul>
                                                        {material.donts.map((item, idx) => (
                                                            <li key={idx}>
                                                                <TranslatableText>{item}</TranslatableText>
                                                                <SpeakButton text={item} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="material-impact">
                                                <h4><TranslatableText>Environmental Impact</TranslatableText></h4>
                                                <p>
                                                    <TranslatableText>{material.impact}</TranslatableText>
                                                    <SpeakButton text={material.impact} />
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tips' && (
                    <div className="recycling-tips">
                        <h2>
                            <TranslatableText>Recycling Tips & Tricks</TranslatableText>
                            <SpeakButton text="Recycling Tips & Tricks" />
                        </h2>
                        <p className="section-intro">
                            <TranslatableText>
                                Follow these expert tips to make your recycling efforts more effective and efficient.
                            </TranslatableText>
                            <SpeakButton text="Follow these expert tips to make your recycling efforts more effective and efficient." />
                        </p>

                        <div className="tips-grid">
                            {recyclingTips.map((tip, index) => (
                                <div className="tip-card" key={index}>
                                    <h3>
                                        <TranslatableText>{tip.title}</TranslatableText>
                                    </h3>
                                    <p>
                                        <TranslatableText>{tip.description}</TranslatableText>
                                        <SpeakButton text={`${tip.title}. ${tip.description}`} />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecyclingAwareness;