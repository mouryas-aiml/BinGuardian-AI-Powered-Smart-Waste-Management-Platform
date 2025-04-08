import React, { useState, useEffect, useRef } from 'react';
import './ChatbotPage.css';
import { useTTS } from './context/TTSContext';

function ChatbotPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm BinBot, your waste management assistant. How can I help you today?",
            sender: 'bot'
        }
    ]);

    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [geminiKey] = useState('AIzaSyBr_j_mTrz2wqEspOFZi4BoDimy7-QvFh0');
    const messagesEndRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [googleApiKey, setGoogleApiKey] = useState('AIzaSyBa5SYKmzh4MPKdcFZkB1LMdInEnsPdbJg');

    // Get the speak function from TTS context
    const { speak } = useTTS();

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Speak welcome message when component mounts
    useEffect(() => {
        if (voiceEnabled && messages.length > 0 && messages[0].sender === 'bot') {
            speak(messages[0].text);
        }
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputText.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user'
        };

        setMessages([...messages, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Try to get a response from the Gemini API
            console.log("Sending request to Gemini API...");
            const response = await fetchGeminiResponse(inputText);
            console.log("Received response:", response);

            const botMessage = {
                id: messages.length + 2,
                text: response,
                sender: 'bot'
            };

            setMessages(prevMessages => [...prevMessages, botMessage]);

            // If voice is enabled, speak the response
            if (voiceEnabled) {
                speak(response);
            }
        } catch (error) {
            console.error("Error getting response from Gemini API:", error);

            // Use keyword-based fallback response system
            const fallbackResponse = getEnhancedKeywordResponse(inputText);
            console.log("Using fallback response:", fallbackResponse);

            const fallbackMessage = {
                id: messages.length + 2,
                text: fallbackResponse,
                sender: 'bot'
            };

            setMessages(prevMessages => [...prevMessages, fallbackMessage]);

            if (voiceEnabled) {
                speak(fallbackResponse);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGeminiResponse = async (userInput) => {
        try {
            console.log("Making request to Gemini API with key:", geminiKey.substring(0, 10) + "...");

            const requestBody = {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `You are BinBot, a helpful waste management assistant. Provide accurate, concise information about recycling, composting, waste disposal, and environmental sustainability. If you're unsure about something, acknowledge it and provide general guidance. Keep responses friendly and educational.

Here's the user's question: ${userInput}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                    topP: 0.95,
                    topK: 40
                }
            };

            console.log("Request body:", JSON.stringify(requestBody, null, 2));

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log("Response status:", response.status);

            const responseText = await response.text();
            console.log("Raw response:", responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log("Parsed response data:", responseData);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                throw new Error(`Failed to parse response`);
            }

            if (!response.ok) {
                throw new Error(`API Error`);
            }

            // Extract text from the Gemini response
            if (responseData.candidates &&
                responseData.candidates[0] &&
                responseData.candidates[0].content &&
                responseData.candidates[0].content.parts &&
                responseData.candidates[0].content.parts[0]) {
                return responseData.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            throw error; // Re-throw the error to trigger fallback
        }
    };

    const getEnhancedKeywordResponse = (userInput) => {
        const userMessageLower = userInput.toLowerCase();

        // Comprehensive keyword matching
        if (userMessageLower.includes('recycle') || userMessageLower.includes('recycling')) {
            if (userMessageLower.includes('plastic') || userMessageLower.includes('bottle')) {
                return "To recycle plastic bottles: 1) Empty and rinse them, 2) Replace caps if your local facility accepts them, 3) Flatten to save space, and 4) Place in your recycling bin. Different plastics have different recycling processes, so check the number inside the recycling symbol on the bottom of the bottle and verify with your local recycling guidelines.";
            } else if (userMessageLower.includes('paper') || userMessageLower.includes('cardboard')) {
                return "Paper and cardboard recycling is straightforward! Remove any plastic wrapping, tape, or non-paper materials. Flatten cardboard boxes to save space. Keep paper dry and clean. Most communities accept newspapers, magazines, office paper, and cardboard in curbside recycling programs.";
            } else if (userMessageLower.includes('glass')) {
                return "Glass is 100% recyclable and can be recycled endlessly without loss in quality! To recycle glass: 1) Rinse containers thoroughly, 2) Remove lids or caps, 3) Sort by color if required by your local facility. Note that some items like window glass, mirrors, and drinking glasses often can't be recycled with container glass.";
            } else {
                return "Recycling helps conserve resources and reduce landfill waste. Always clean containers before recycling, remove non-recyclable components, and follow your local guidelines. Common recyclables include paper, cardboard, plastic containers (check the numbers), glass bottles, and aluminum cans. What specific material would you like to know about?";
            }
        } else if (userMessageLower.includes('compost') || userMessageLower.includes('composting')) {
            if (userMessageLower.includes('what') || userMessageLower.includes('items') || userMessageLower.includes('can')) {
                return "Compostable items include: 1) Fruit and vegetable scraps, 2) Coffee grounds and filters, 3) Tea bags (remove staples), 4) Eggshells, 5) Yard trimmings and leaves, 6) Shredded newspaper and cardboard, 7) Nutshells, and 8) Wood chips. Avoid meat, dairy, oils, pet waste, diseased plants, and treated wood as these can cause odors or attract pests.";
            } else if (userMessageLower.includes('how') || userMessageLower.includes('start')) {
                return "To start composting: 1) Choose a dry, shady spot for your compost pile or bin, 2) Add brown materials (dead leaves, branches, twigs) and green materials (grass clippings, vegetable waste, fruit scraps) in alternating layers, 3) Add a thin layer of soil to introduce microorganisms, 4) Keep the compost moist but not soggy, 5) Turn the pile regularly to provide oxygen. Your compost is ready when it's dark, crumbly, and earthy-smelling.";
            } else {
                return "Composting is nature's way of recycling organic matter into valuable fertilizer. It reduces landfill waste and creates nutrient-rich soil for your garden. A good compost mix needs 'browns' (carbon-rich materials like dead leaves and paper) and 'greens' (nitrogen-rich materials like food scraps and grass clippings). What specific aspect of composting would you like to learn about?";
            }
        } else if (userMessageLower.includes('electronic') || userMessageLower.includes('e-waste')) {
            return "Electronic waste should never go in regular trash due to hazardous components. Many options exist for responsible disposal: 1) Retailer take-back programs (Best Buy, Apple, etc.), 2) Manufacturer recycling programs, 3) Local e-waste collection events, 4) Municipal hazardous waste facilities, or 5) Donation if the items still work. Before recycling, be sure to back up and then wipe all personal data from your devices.";
        } else if (userMessageLower.includes('pickup') || userMessageLower.includes('collection')) {
            return "Waste collection schedules vary by location. To find your specific pickup times: 1) Check your local municipality website, 2) Call your waste management provider, 3) Download your city's waste management app if available, or 4) Ask neighbors about the schedule. Many areas also offer calendar reminders or text alerts for regular and special collections.";
        } else if (userMessageLower.includes('hazardous') || userMessageLower.includes('chemical') || userMessageLower.includes('paint')) {
            return "Hazardous waste requires special handling. This includes paint, batteries, pesticides, cleaning products, and automotive fluids. Most communities have designated collection facilities or special collection days for these items. Never pour them down drains or place them in regular trash. Many hardware stores also accept items like batteries and paint for proper disposal.";
        } else if (userMessageLower.includes('reduce') || userMessageLower.includes('reuse')) {
            return "Reducing and reusing come before recycling! To reduce waste: 1) Buy only what you need, 2) Choose products with minimal packaging, 3) Bring reusable bags when shopping, 4) Use refillable water bottles and coffee cups, 5) Opt for digital documents instead of paper, 6) Buy in bulk to reduce packaging, and 7) Repair items instead of replacing them when possible.";
        }

        // General waste management response for other queries
        return "As your waste management assistant, I can help with questions about recycling, composting, e-waste disposal, hazardous waste, waste reduction strategies, and local collection services. Could you please specify what aspect of waste management you'd like information about?";
    };

    // Toggle voice feature
    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h1>BinBot Assistant</h1>
                <p>Ask me anything about waste management and recycling</p>
                <button
                    className={`voice-toggle ${voiceEnabled ? 'active' : ''}`}
                    onClick={toggleVoice}
                    disabled={isSpeaking}
                >
                    {voiceEnabled ? 'Voice: ON' : 'Voice: OFF'}
                </button>
            </div>

            <div className="chat-window">
                <div className="messages">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
                        >
                            {message.text}
                            {message.sender === 'bot' && (
                                <button
                                    className="speak-button"
                                    onClick={() => speak(message.text)}
                                    disabled={isSpeaking}
                                    title="Listen to this message"
                                >
                                    🔊
                                </button>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot loading">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="message-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your question here..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>

            <div className="suggested-questions">
                <h3>Suggested Questions</h3>
                <div className="question-buttons">
                    <button
                        onClick={() => setInputText("How do I recycle plastic bottles?")}
                        disabled={isLoading}
                    >
                        How do I recycle plastic bottles?
                    </button>
                    <button
                        onClick={() => setInputText("What items can be composted?")}
                        disabled={isLoading}
                    >
                        What items can be composted?
                    </button>
                    <button
                        onClick={() => setInputText("Where can I dispose of electronic waste?")}
                        disabled={isLoading}
                    >
                        Where can I dispose of electronic waste?
                    </button>
                    <button
                        onClick={() => setInputText("When is my waste collection day?")}
                        disabled={isLoading}
                    >
                        When is my waste collection day?
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatbotPage; 