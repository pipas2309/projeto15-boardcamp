import express from 'express';
import { createGames, getGames } from '../controllers/gameControllers.js';
import validateGame from '../middlewares/validateGame.js';


const router = express.Router();

router.get("", getGames);
router.post("", validateGame, createGames);

export default router;