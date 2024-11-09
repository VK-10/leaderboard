import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]); // Define leaderboard state

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/leaderboard');
                setLeaderboard(response.data.leaderboard); // Update leaderboard state with data
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div>
            <h1>Leaderboard</h1>
            <ul>
                {leaderboard.map((player, index) => (
                    <li key={index}>
                        {player.username}: {player.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
