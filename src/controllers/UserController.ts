import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';

 const redisClient = new Redis({
    host: '127.0.0.1',  // Redis server address
    port: 6379,          // Default Redis port
  });
  
  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

const JWT_SECRET = process.env.JWT_SECRET ||'abc1234';



export const register = async (req: Request, res: Response): Promise<void> =>{
    const {username, password} = req.body;

    const userExists = await redisClient.exists(`user:${username}`);
    if(userExists) {
        res.status(400).json({message: 'User already exists'});
        return;
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await redisClient.hset(`user:${username}`,{
        password: hashedPassword,
        createdAt : new Date().toISOString(),
        highScore: 0,
    });

    res.status(201).json({message: 'User registered successfully'});
};

//login

export const login = async(req: Request, res : Response): Promise<void> =>{
    const {username, password} = req.body;

    const hashedPassword = await redisClient.hget(`user:${username}`, 'password');
    if(!hashedPassword) {
        res.status(400).json({message : 'INvalid username or password'});
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if(!isPasswordValid) {
        res.status(400).json({message : 'Invalid username or password'});
        return ;
    }

    const token = jwt.sign({username}, JWT_SECRET, {expiresIn : '1h'});

    res.status(200).json({ token });
}

export const submitscore = async (req: Request, res : Response): Promise<void> => {
    const { username, score } = req.body;

    const userExists = await redisClient.exists(`user:${username}`);

    if(!userExists) {
        res.status(400).json({message : "user doesnt exist"});
        return;
    }

    const currentScore = await redisClient.zscore('leaderboard', username);

    if(currentScore === null || parseInt(currentScore) < score) {
        await redisClient.zadd('leaderboard', score, username);
        res.status(200).json({messsage : `${username}'s score of ${score} added successfully`});
    } else {
        res.status(200).json({message : `${username}'s score was not updated is not higher `});
    }

   
};

export const getLeaderboard = async (req: Request, res: Response) : Promise<void> =>{
    // top 10 players
    const leaderboard = await redisClient.zrevrange('leaderboard', 0,9,'WITHSCORES');

    const topPlayers = [];
    for(let i = 0; i < leaderboard.length; i += 2) {
        topPlayers.push({
            username: leaderboard[i],
            score: parseInt(leaderboard[i+1])
        });
    }

    res.status(200).json({leaderboard: topPlayers})
};

export const getPlayerRank = async (req: Request, res: Response) : Promise<void> => {
    const {username} = req.params;

    try {
        const rank = await redisClient.zrevrank('leaderboard', username);

        if( rank === null) {
            res.status(404).json({message: "Player not found"});

        }else{
            res.status(200).json({username, rank : rank + 1});
        }
    } catch (error) {
        res.status(500).json({message : "Error retrieving player rank", error});
    }
};



