import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // External CSS for better styling

const socket = io.connect("http://192.168.1.4:5000"); // // sample Backend IP 

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("Guest");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false); // State to toggle dark mode

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected successfully!');
        });

        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('user_typing', (data) => {
            setTypingUser(data.username);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000); // Clear typing indicator after 3 seconds
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_typing');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                text: message,
                sender: username,
                avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('send_message', msgData); // Send to server
            setMessage(""); // Clear the input field
        }
    };

    const handleTyping = () => {
        socket.emit('typing', { username });
    };

    // Toggle dark mode
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`chat-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
    <div className="header">
        <h1>Anonymous Chat App</h1>
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="username-input"
        />
        <button onClick={toggleTheme} className="theme-toggle-button">
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
    </div>
    <div className="chat-window">
        {messages.map((msg, index) => (
            <div
                key={index}
                className={`message ${msg.sender === username ? 'own-message' : 'other-message'}`}
            >
                <img
                    src={msg.avatar}
                    alt="User Avatar"
                    className="avatar"
                />
                <div className="message-content">
                    <span className="message-sender">{msg.sender}</span>
                    <p className="message-text">{msg.text}</p>
                    <span className="message-timestamp">{msg.timestamp}</span>
                </div>
            </div>
        ))}

        {isTyping && (
            <div className="typing-indicator">
                {typingUser} is typing...
            </div>
        )}
    </div>
    <div className="message-input-container">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type your message..."
            className="message-input"
        />
        <button onClick={sendMessage} className="send-button">
            Send
        </button>
    </div>
</div>

    );
}

export default App;
