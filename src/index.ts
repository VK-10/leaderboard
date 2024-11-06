import express from 'express'
import userRoutes from './routes/UserRoutes'
import dotenv from 'dotenv';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users',userRoutes);

app.get('/', (req,res) =>{
    res.send('Leaderboard API is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));