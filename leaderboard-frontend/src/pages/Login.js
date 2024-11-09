import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuthToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/users/login', { username ,password});
            const { token } = response.data;
            localStorage.setItem('authToken', token);

        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <form onSubmit = {handleLogin}>
            <input type = "text" placeholder = "username" onChange = { (e) => setUsername(e.target.value)} />
            <input type = "password" placeholder = "Password" onChange={(e) => setPassword(e.target.value)} />
            <button type = "submit"> Login</button>
        </form>
    )
};



export default Login;