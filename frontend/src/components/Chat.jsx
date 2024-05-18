import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { encryptMessage, decryptMessage } from '../utilities/crypto';
import { deriveKey } from '../utilities/deriveKey';

const Chat = () => {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [derivedKey, setDerivedKey] = useState(null); // State for imported contact key



    useEffect(() => {
        const fetchData = async () => {
            try {
                setDerivedKey(await deriveKey(username)); // Wait for deriveKey to complete
            } catch (error) {
                console.error('Error:', error.message);
            }
        };
        fetchData();
        return () => {
        
        };
    }, [username]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (derivedKey) {
                    const res = await axios.get(`http://localhost:3001/api/messages/${username}`, { withCredentials: true });
                    const encryptedMessages = res.data;
    
                    console.log("Encrypted messages", encryptedMessages);
                    console.log("Derived key inside fetch", derivedKey);
    
                    const decryptedMessages = await Promise.all(encryptedMessages.map(async (encryptedMessage) => {
                        try {
                            if (encryptedMessage.message.startsWith("ENCRYPTED:")) {
                                const encryptedData = encryptedMessage.message.substring("ENCRYPTED:".length);
                                const decryptedMessage = await decryptMessage(encryptedData, derivedKey);
                                return decryptedMessage;
                            } else {
                                return encryptedMessage.message;  
                            }
                        } catch (error) {
                            console.error('Error decrypting message:', error);
                        }
                    }));
    
                    console.log(decryptedMessages);
                    setMessages(decryptedMessages);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchMessages();
    }, [derivedKey, username]);
    
    const sendMessage = async () => {
        try {
            
            console.log("Key inside send message", derivedKey)
            const encryptedMessage = await encryptMessage(message, derivedKey);
            console.log(encryptedMessage)
            const res = await axios.post(`http://localhost:3001/api/messages/send/${username}`, {
                message: `ENCRYPTED:${encryptedMessage}`
            }, { withCredentials: true });
          
            setMessage('');
            console.log(res.data)
        } catch (error) {
            console.error('Error sending message: ', error.message);
        }
    }

    return (
        <div className="h-screen flex justify-center items-center flex-col bg-[var(--uncblue)]">
            <div className="max-w-md w-full p-8 bg-gray-200 rounded-t-2xl shadow-md">
                <h2 className="mb-4">Chatting with {username}</h2>
                <div className="chat-container">
                {messages.map((message, index) => (
        <div key={index} className="message">
          <p>{message}</p>
        </div>
      ))}
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