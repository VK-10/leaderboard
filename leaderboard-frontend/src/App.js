import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes , Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Leaderboard from './pages/Leaderboard';
import SubmitScore from './components/SubmitScore';
import Home from './components/Home';
const App = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />  {/* Add a home route */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                <Route path="/leaderboard" element={authToken ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/submit-score" element={<SubmitScore />} />
            </Routes>
        </Router>
    );
};

export default App;

