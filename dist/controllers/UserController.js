"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerRank = exports.getLeaderboard = exports.submitscore = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ioredis_1 = __importDefault(require("ioredis"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const redisClient = new ioredis_1.default({
    host: '127.0.0.1', // Redis server address
    port: 6379, // Default Redis port
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
const JWT_SECRET = 'abc1234';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const userExists = yield redisClient.exists(`user:${username}`);
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield redisClient.hset(`user:${username}`, {
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        highScore: 0,
    });
    res.status(201).json({ message: 'User registered successfully' });
});
exports.register = register;
//login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = yield redisClient.hget(`user:${username}`, 'password');
    if (!hashedPassword) {
        res.status(400).json({ message: 'INvalid username or password' });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, hashedPassword);
    if (!isPasswordValid) {
        res.status(400).json({ message: 'Invalid username or password' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
});
exports.login = login;
const submitscore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, score } = req.body;
    const userExists = yield redisClient.exists(`user:${username}`);
    if (!userExists) {
        res.status(400).json({ message: "user doesnt exist" });
        return;
    }
    const currentScore = yield redisClient.zscore('leaderboard', username);
    if (currentScore === null || parseInt(currentScore) < score) {
        yield redisClient.zadd('leaderboard', score, username);
        res.status(200).json({ messsage: `${username}'s score of ${score} added successfully` });
    }
    else {
        res.status(200).json({ message: `${username}'s score was not updated is not higher ` });
    }
});
exports.submitscore = submitscore;
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // top 10 players
    const leaderboard = yield redisClient.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
    const topPlayers = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
        topPlayers.push({
            username: leaderboard[i],
            score: parseInt(leaderboard[i + 1])
        });
    }
    res.status(200).json({ leaderboard: topPlayers });
});
exports.getLeaderboard = getLeaderboard;
const getPlayerRank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const rank = yield redisClient.zrevrank('leaderboard', username);
        if (rank === null) {
            res.status(404).json({ message: "Player not found" });
        }
        else {
            res.status(200).json({ username, rank: rank + 1 });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving player rank", error });
    }
});
exports.getPlayerRank = getPlayerRank;
