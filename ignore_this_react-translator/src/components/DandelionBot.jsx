import React, { useState, useEffect } from 'react';
import RiveScript from 'rivescript';
import { pipeline } from '@huggingface/transformers';

const DandelionBot = () => {
    const [inputText, setInputText] = useState(''); // User input
    const [outputText, setOutputText] = useState('Hi! I am Dandelion Bot. How can I help you?'); // Bot output
    const [conversationTurn, setConversationTurn] = useState(0); // Track conversation turns
    const [generator, setGenerator] = useState(null); // Transformer.js instance
    const [riveBot, setRiveBot] = useState(null); // RiveScript bot instance

    // Load both bots when the component mounts
    useEffect(() => {
        const loadRiveBot = async () => {
            const bot = new RiveScript();
            try {
                // await bot.loadFile('bot.rive'); // Ensure the file is in the public folder
                const response = await fetch('bot.rive');
                // console.log("response from bot.rive", response);
                const riveScript = await response.text();
                // console.log("This is the text in bot.rive");
                // console.log("--------------------");
                // console.log(riveScript);
                // console.log("--------------------");
                bot.stream(riveScript); // Load the script from the string
                bot.sortReplies();
                // await riveBot.setUservar('local-user', 'topic', 'random');
                setRiveBot(bot);
                console.log('RiveScript bot loaded successfully.');
            } catch (error) {
                console.error('Error loading RiveScript bot:', error);
            }
        };

        const loadTransformer = async () => {
            try {
                const loadedPipeline = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
                    dtype: 'q4',
                    device: 'webgpu',
                });
                setGenerator(() => loadedPipeline); // Store the generator
                console.log('Transformer.js model loaded successfully.');
            } catch (error) {
                console.error('Error loading Transformer.js model:', error);
            }
        };

        loadRiveBot();
        loadTransformer();
    }, []);

    // Function to handle chat based on conversation turn
    const handleChat = async () => {
        if (!inputText.trim()) return; // Prevent empty input

        const userMessage = inputText.trim();

        // Append user's message to the conversation
        setOutputText((prev) => `${prev}\nYou: ${userMessage}`);

        setInputText(''); // Clear the input field
        console.log("riveBot", riveBot);
        try {
            if (conversationTurn < 3 && riveBot) {
                // Use RiveScript bot for the first 3 turns
                console.log("RiveScript bot is being used for the first 3 turns");
                const reply = await riveBot.reply('local-user', userMessage);
                setOutputText((prev) => `${prev}\nDandelion Bot: ${reply}`);
                console.log('RiveScript reply:', reply);
            } else if (generator) {
                // Switch to Transformer.js for subsequent turns
                const messages = [
                    {
                        role: 'system',
                        content:
                            'You are not AI, and do not give any signs indicating that you are AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.',
                    },
                    { role: 'user', content: userMessage },
                ];
                const output = await generator(messages, { max_new_tokens: 128 });
                const generatedText = output[0]?.generated_text || '...';
                setOutputText((prev) => `${prev}\nDandelion Bot: ${generatedText[2].content}`);
                console.log('Transformer.js output:', generatedText[2].content);
            } else {
                setOutputText((prev) => `${prev}\nDandelion Bot: Sorry, I am not ready yet.`);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setOutputText((prev) => `${prev}\nDandelion Bot: Something went wrong.`);
        }

        // Increment conversation turn
        setConversationTurn((prev) => prev + 1);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>Dandelion Bot</h1>
            <div
                style={{
                    height: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    padding: '10px',
                    marginBottom: '10px',
                    whiteSpace: 'pre-line',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                }}
            >
                {outputText}
            </div>
            <textarea
                rows={4}
                cols={50}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                style={{
                    display: 'block',
                    margin: '10px auto',
                    padding: '10px',
                    fontSize: '16px',
                    width: '100%',
                }}
            />
            <button
                onClick={handleChat}
                style={{
                    display: 'block',
                    margin: '10px auto',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                }}
            >
                Send
            </button>
        </div>
    );
};

export default DandelionBot;
