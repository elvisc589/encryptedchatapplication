import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
   
        try{
            const res = await axios.post('http://localhost:3001/api/auth/login', {
                username,
                password
            }, {withCredentials: true})

            const user = res.data
            console.log('Logged in user: ', user)

            navigate('/contacts')
          
        } catch (error) {
            console.error('Error logging in: ', error.message)
        }
       
    };

    return (
        <div className="h-screen flex justify-center items-center bg-[var(--uncblue)]">
            <div className="max-w-md w-full p-8 bg-gray-200 rounded-2xl shadow-md flex flex-col justify-center items-center">
                <h2 className="mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label className="block mb-2">Username</label>
                        <input
                            type="username"
                            name="username" 
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
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm">Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
           
            </div>
        </div>
    );
};

export default Login;
