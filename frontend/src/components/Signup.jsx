import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
   
        try {
            if (password !== confirmPassword){
                console.log("Passwords do not match")
                return;
            }
            if (password.length < 6){
                console.log("Password must be at least 6 character long")
                return;
            }
            const res = await axios.post('http://localhost:3001/api/auth/signup', {
                fullName,
                username,
                password,
                confirmPassword
            });

            const user = res.data;
            console.log('Registered user:', user);
          
        } catch (error) {
            console.error('Error signing up:', error.message);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-[var(--uncblue)]">
            <div className="max-w-md w-full p-8 bg-gray-200 rounded-2xl shadow-md flex flex-col justify-center items-center">
                <h2 className="mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label className="block mb-2">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-sm">Already have an account? <a href="/login" className="text-blue-500">Log in</a></p>
            </div>
        </div>
    );
};

export default Signup;
