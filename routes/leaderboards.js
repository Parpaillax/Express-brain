import express from "express";
import Leaderboards from "../models/Leaderboards.js"

const router = express.Router();

router.get('/', async (req, res) => {
  const leaderboards = await Leaderboards.find().populate('user', 'nickName');
  res.render('leaderboard/leaderboards', {leaderboards})
})

export default router;
