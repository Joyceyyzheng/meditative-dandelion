import React, { useState, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';

const ChatBot = () => {
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [botReply, setBotReply] = useState('');
    const [chatbotPipeline, setChatbotPipeline] = useState("default hello world");

    useEffect(() => {
        const initializePipeline = async () => {
            const pipelineInstance = await pipeline('text-classification', 'Xenova/toxic-bert');
            setChatbotPipeline(pipelineInstance);
        };
        initializePipeline();
    }, []);

    const handleSendMessage = async () => {
        if (!chatbotPipeline) return;
        const newConversation = [...conversation, { role: 'user', content: userInput }];
        setConversation(newConversation);

        const response = await chatbotPipeline(userInput);
        const botMessage = response[0].generated_text;
        setBotReply(botMessage);

        setConversation((prev) => [...prev, { role: 'bot', content: botMessage }]);
        setUserInput('');
    };

    return (
        <div>
            <div>
                {/* {conversation.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
                    </div>
                ))} */}
            </div>
            <input
                type="text"
                value={userInput}
                // onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatBot;
