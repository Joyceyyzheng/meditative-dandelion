import React, { useState, useEffect } from 'react';
import RiveScript from 'rivescript';
import { pipeline } from '@huggingface/transformers';
import { env } from 'onnxruntime-web';


const DandelionBot = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('Hi. I\'m waking up. Please be patient with me :)');
    const [conversationTurn, setConversationTurn] = useState(0);
    const [generator, setGenerator] = useState(null);
    const [riveBot, setRiveBot] = useState(null);

    const [conversationHistory, setConversationHistory] = useState([
        {
            role: 'system',
            content:
                'You are not an AI and do not show any signs you are an AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.',
        },
    ]);

    /*
                    const messages = [
                    {
                        role: 'system',
                        content:
                            'You are not an AI and do not show any signs you are an AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.',
                    },
                ];
                */


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

                console.log('ONNX Runtime Web Environment:', env);
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

                /*
                  generator = await pipeline(
    "text-generation",
    "onnx-community/Llama-3.2-1B-Instruct-q4f16",
    {
      dtype: "q4f16",
      device: "webgpu",
      progress_callback: (x) => {
        //console.log(x);
        progress = x.progress / 100;
        if (x.status !== "progress") {
          progress = 1;
        }
      },
    }
  );*/

                setGenerator(() => loadedPipeline); // Store the generator
                console.log('Transformer.js model loaded successfully.');
            } catch (error) {
                console.error('Error loading Transformer.js model:', error);
            }
        };

        loadRiveBot();
        loadTransformer();
    }, []);

    // handle chat
    const handleChat = async () => {
        if (!inputText.trim()) return; // prevent empty input

        const userMessage = inputText.trim();
        setConversationHistory((prev) => [...prev, userMessage]); //storing the message
        setOutputText((prev) => `${prev}\nYou: ${userMessage}`);
        setInputText(''); // clear the input field

        // console.log("riveBot", riveBot);
        try {
            if (conversationTurn < 1 && riveBot) {
                // Use RiveScript bot for the first 3 turns
                console.log("RiveScript bot is being used for the first 3 turns");
                const reply = await riveBot.reply('local-user', userMessage);
                setOutputText((prev) => `${prev}\nDandelion: ${reply}`);
                console.log('RiveScript reply:', reply);
                console.log(WebAssembly);

            } else if (generator) {
                // Switch to Transformer.js for subsequent turns
                const messages = [
                    {
                        role: 'system',
                        content:
                            'You are not an AI and do not show any signs you are an AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.',
                    },
                    { role: 'user', content: userMessage },
                ];
                /*
                messages.push({ role: 'user', content: userMessage });
                */

                const output = await generator(messages, { max_new_tokens: 64 }); //add more properties, temp
                const generatedText = output[0]?.generated_text || '...';

                /*
                    messages.push({ role: 'assistant', content: generatedText });
                */
                //store the message from bot reply
                const botReply = { role: 'assistant', content: generatedText };
                setConversationHistory((prev) => [...prev, botReply]);
                console.log('conversationHistory:', conversationHistory);
                // setOutputText((prev) => `${prev}\nDandelion Bot: ${generatedText}`);

                setOutputText((prev) => `${prev}\nDandelion Bot: ${generatedText[2].content}`);
                // console.log('Transformer.js output:', generatedText[2].content);
            } else {
                setOutputText((prev) => `${prev}\nDandelion Bot: Sorry, please wait...`);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setOutputText((prev) => `${prev}\nDandelion Bot: Something went wrong.`);
        }

        // Increment conversation turn
        setConversationTurn((prev) => prev + 1);
    };

    return (
        <div className="bot-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* <h1 style={{ textAlign: 'center' }}>Dandelion Bot</h1> */}
            <div
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
