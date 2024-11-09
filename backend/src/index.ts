import express from 'express'
import userRoutes from './routes/UserRoutes'
import dotenv from 'dotenv';
import cors from 'cors';
import { getLeaderboard } from './controllers/UserController';

// const corsOptions = {
//     origin: 'http://localhost:3001',  // Allow only this origin
//     methods: ['GET', 'POST'],         // Allow specific HTTP methods
//     allowedHeaders: ['Content-Type'], // Allow specific headers
//   };

const app = express();

app.use(cors());

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users',userRoutes);

app.get('/api/leaderboard', getLeaderboard);

app.get('/', (req,res) =>{
    res.send('Leaderboard API is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));