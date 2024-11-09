import React, { useState } from 'react';
import axios from 'axios';

const SubmitScore = () => {
    const [score, setScore]  = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            await axios.post('http://localhost:3000/api/submitscore', { score }, {
                headers : {Authorization : `Bearer ${token}` }
            });
            alert('Score submitted successfully!');

        } catch (error) {
            console.error('Error submitting score', error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} />
        <button type="submit">Submit Score</button>
    </form>
    )
};

export default SubmitScore;

