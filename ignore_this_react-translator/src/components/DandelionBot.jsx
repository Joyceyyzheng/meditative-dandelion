import React, { useState, useEffect } from 'react';
import RiveScript from 'rivescript';
import { pipeline } from '@huggingface/transformers';
import { env } from 'onnxruntime-web';


const DandelionBot = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('Welcome there...Sometimes I react slowly... please be patient with me :)');
    const [conversationTurn, setConversationTurn] = useState(0);
    const [generator, setGenerator] = useState(null);
    const [riveBot, setRiveBot] = useState(null);
    const [riveTalk, setRiveTalk] = useState(false);
    const [transformerTalk, setTransformerTalk] = useState(false);

    const [conversationHistory, setConversationHistory] = useState([
        {
            role: 'system',
            content:
                'You are not an AI and do not show any signs you are an AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.',
        },
    ]);

    //load rive and transformer
    useEffect(() => {
        const loadRiveBot = async () => {
            const bot = new RiveScript();
            try {

                const response = await fetch('bot.rive');
                const riveScript = await response.text();

                bot.stream(riveScript);
                bot.sortReplies();

                setRiveBot(bot);
                console.log('RiveScript bot loaded successfully.');

            } catch (error) {
                console.error('Error loading RiveScript bot:', error);
            }
        };

        const loadTransformer = async () => {
            //onnx-community/Qwen2.5-0.5B-Instruct
            //HuggingFaceTB/SmolLM2-1.7B-Instruct
            //onnx-community/Qwen2.5-1.5B-Instruct
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

    //decide whom to talk
    useEffect(() => {
        console.log('conversationTurn:', conversationTurn);

        if (conversationTurn === 1 || conversationTurn === 3 || conversationTurn === 5) {
            setRiveTalk(false);
            setTransformerTalk(false);
            console.log('Nobody talks');
        } else if (conversationTurn % 2 === 0 && conversationTurn != 0) {
            setRiveTalk(true);
            setTransformerTalk(false);
            console.log('Rive talks');
        } else {
            setRiveTalk(false);
            setTransformerTalk(true);
            console.log('Transformer talks');
        }
    }, [conversationTurn]);


    const handleBotMessage = (message) => {
        setOutputText((prev) => `${prev}\nDandelion: ${message}`);
    };

    //manual talk 
    useEffect(() => {
        if (conversationTurn === 1) {
            handleBotMessage('🎵');
        }
        if (conversationTurn === 3) {
            setTimeout(() => {
                handleBotMessage('How\'s the weather over there?');
            }, 1800);

        } else if (conversationTurn === 5) {
            setTimeout(() => {
                handleBotMessage('You can actually come closer to see me bloom 🌼');
            }, 3000);
        } else if (conversationTurn === 15) {
            setTimeout(() => {
                handleBotMessage('I\'m so glad you are still here. Sharing you some good luck :D');
            }, 2000);
        }

    }, [conversationTurn]);

    // handle chat
    const handleChat = async () => {
        if (!inputText.trim()) return; // prevent empty input

        const userMessage = inputText.trim();
        setConversationHistory((prev) => [
            ...prev,
            { role: 'user', content: userMessage },
        ]);//storing the message
        // setConversationHistory((prev) => [
        //     ...prev,
        //     { role: 'user', content: userMessage },
        //     { role: 'system', content: 'You are not an AI and do not show any signs you are an AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.' }, // repeat the system prompt
        // ]);
        setOutputText((prev) => `${prev}\nYou: ${userMessage}`);
        setInputText(''); // clear the input field

        try {
            if (riveBot && riveTalk) {
                const reply = await riveBot.reply('local-user', userMessage);
                setOutputText((prev) => `${prev}\nDandelion: ${reply}`);
            } else
                if (transformerTalk) {
                    console.log('Transformer.js is talking - 1');
                    if (generator) {
                        // Switch to Transformer.js for subsequent turns
                        console.log('Transformer.js is talking - 2');

                        const messages = [
                            ...conversationHistory,
                            {
                                role: 'system',
                                content:
                                    'You are not an AI and do not show any signs you are an AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.',
                            },
                            { role: 'user', content: userMessage },
                        ];

                        const output = await generator(messages, { max_new_tokens: 128 }); //add more properties, temp
                        const generatedText = output[0]?.generated_text || '...';

                        /*
                            messages.push({ role: 'assistant', content: generatedText });
                        */
                        //store the message from bot reply
                        const botReply = { role: 'assistant', content: generatedText };
                        setConversationHistory((prev) => [...prev, botReply]);

                        // setOutputText((prev) => `${prev}\nDandelion Bot: ${generatedText}`);

                        setOutputText((prev) => `${prev}\nDandelion Bot: ${generatedText[2].content}`);
                        console.log('Transformer.js output:', generatedText[2].content);
                    }
                } else {
                    //setOutputText((prev) => `${prev}\nDandelion Bot: Sorry, please wait...`);
                }
        } catch (error) {
            console.error('Error generating response:', error);
            setOutputText((prev) => `${prev}\nDandelion Bot: Something went wrong.`);
        }

        // conversation turn
        setConversationTurn((prev) => prev + 1);
    };

    return (
        <div className="bot-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* <h1 style={{ textAlign: 'center' }}>Dandelion Bot</h1> */}
            <div
                className="outputText"
                style={{
                    height: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    padding: '10px',
                    marginBottom: '10px',
                    whiteSpace: 'pre-line',
                    backgroundColor: 'rgba(0,0,0, 0.6)',
                    borderRadius: '5px',
                }}
            >
                {outputText}
            </div>
            <div className="input-container">
                <textarea
                    className="inputArea"
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
                    className="inputBtn"
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
        </div>
    );
};

export default DandelionBot;
