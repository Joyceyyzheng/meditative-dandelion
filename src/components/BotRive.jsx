import React, { useState, useEffect } from 'react';
import RiveScript from 'rivescript';

const RiveBot = () => {
    const [bot, setBot] = useState(null); // Holds the RiveScript bot instance
    const [userInput, setUserInput] = useState(''); // User's input text
    const [botReply, setBotReply] = useState(''); // Bot's reply

    // Function to load the RiveScript bot
    const loadBot = async () => {
        const botInstance = new RiveScript();
        console.info(botInstance)
        try {
            await botInstance.loadFile('/bot.rive.txt'); // Load the RiveScript file
            botInstance.sortReplies(); // Prepare the bot
            setBot(botInstance); // Save the bot instance in state
        } catch (error) {
            console.error('Error loading RiveScript bot:', error);
        }
    };

    // Function to handle chat interaction
    const handleChat = async () => {
        if (!bot || !userInput.trim()) return;

        try {
            const reply = await bot.reply('local-user', userInput.trim());
            setBotReply(reply); // Set the bot's reply
            setUserInput(''); // Clear the user input
        } catch (error) {
            console.error('Error getting bot reply:', error);
        }
    };

    // Load the bot when the component mounts
    useEffect(() => {
        loadBot();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>React RiveScript ChatBot</h1>
            <div style={{ marginBottom: '20px' }}>
                <textarea
                    id="user_input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message here..."
                    rows="4"
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>
            <button
                id="submit"
                onClick={handleChat}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Submit
            </button>
            <div
                id="output"
                style={{
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                }}
            >
                {botReply || 'Bot will respond here.'}
            </div>
        </div>
    );
};

export default RiveBot;
