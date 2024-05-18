import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [composeOpen, setComposeOpen] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/messages', 
                { withCredentials: true });
                console.log(res.data)
                setContacts(res.data);
            } catch (error) {
                console.error('Error fetching contacts: ', error.message);
            }
        };

        fetchContacts();
    }, []); 

    const handleCompose = () => {
        setComposeOpen(true);
    };

    const handleCloseCompose = () => {
        setComposeOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/api/messages/send/${recipient}`, {
                message: message
            }, { withCredentials: true });
            // Close the compose overlay and reset form values
            setComposeOpen(false);
            setRecipient('');
            setMessage('');
            console.log(res.data)
        } catch (error) {
            console.error('Error sending message: ', error.message);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-[var(--uncblue)]">
            <div className="max-w-md w-full p-8 bg-gray-200 rounded-2xl shadow-md flex flex-col justify-center items-center">
                <div className="flex justify-between w-full mb-4">
                    <h2 className="mb-4 text-left">Contacts</h2>
                    <button onClick={handleCompose} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Compose
                    </button>
                </div>
                <div className="flex justify-between w-full mb-4">
                    <ul className="flex-1">
                        {contacts.map((contact, index) => (
                            <li key={index}>
                                <Link to={`/chat/${contact}`} className="block">{contact}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {composeOpen && (
                    <div className="compose-overlay fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="compose-form bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Compose Message</h3>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="To: (username)"
                                className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Message"
                                rows="4"
                                className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex justify-between">
                                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                                    Send
                                </button>
                                <button onClick={handleCloseCompose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contacts;
