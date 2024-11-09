"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const UserController_1 = require("./controllers/UserController");
// const corsOptions = {
//     origin: 'http://localhost:3001',  // Allow only this origin
//     methods: ['GET', 'POST'],         // Allow specific HTTP methods
//     allowedHeaders: ['Content-Type'], // Allow specific headers
//   };
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api/users', UserRoutes_1.default);
app.get('/api/leaderboard', UserController_1.getLeaderboard);
app.get('/', (req, res) => {
    res.send('Leaderboard API is running');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
