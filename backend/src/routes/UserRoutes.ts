import  express from "express";

import {register, login, submitscore, getLeaderboard, getPlayerRank} from '../controllers/UserController'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/submitScore', submitscore);
router.get('/leaderboard', getLeaderboard);
router.get('/rank/:username', getPlayerRank);

export default router;