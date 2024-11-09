import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Send registration request to backend
            const response = await axios.post('http://localhost:3000/api/users/register', {
                username,
                password
            });
            
            setMessage(response.data.message); // Success message from backend
            setError(null); // Clear any previous error message
            setUsername(''); // Clear the form fields
            setPassword('');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setMessage(null); // Clear success message on error
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;
