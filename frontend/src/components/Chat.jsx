import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const Chat = () => {
    const { username } = useParams();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    // Listen for new messages from the server
    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }
        return () => {
            if (socket) {
                socket.off('newMessage');
            }
        };
    }, [socket]);

    useEffect(() => {
        const fetchChatMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/messages/${username}`, 
                    { withCredentials: true });
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching chat messages:', error.message);
            }
        };

        fetchChatMessages();

        return () => {
            
        };
    }, [username]); 

    const sendMessage = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/api/messages/send/${username}`, {
                message: message
            }, { withCredentials: true });
          
            setMessage('');
            console.log(res.data)
        } catch (error) {
            console.error('Error sending message: ', error.message);
        }
    }

    // Render chat messages with different background colors based on sender
    const renderChatMessages = (messages) => {
        return messages.map((message, index) => (
            <div
                key={index}
                className={`message p-2 rounded-md ${message[1] === 'logged' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            >
                {message[0].message}
            </div>
        ));
    };

    return (
        <div className="h-screen flex justify-center items-center flex-col bg-[var(--uncblue)]">
            <div className="max-w-md w-full p-8 bg-gray-200 rounded-t-2xl shadow-md">
                <h2 className="mb-4">Chatting with {username}</h2>
                <div className="chat-container">
                    {renderChatMessages(messages)} 
                </div>
            </div>
            <div className="max-w-md w-full p-8 bg-gray-200 rounded-b-2xl shadow-md">
                {/* Input field for composing message */}
                <div className="flex justify-between">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here"
                        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;