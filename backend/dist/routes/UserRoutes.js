"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const router = express_1.default.Router();
router.post('/register', UserController_1.register);
router.post('/login', UserController_1.login);
router.post('/submitScore', UserController_1.submitscore);
router.get('/leaderboard', UserController_1.getLeaderboard);
router.get('/rank/:username', UserController_1.getPlayerRank);
exports.default = router;
