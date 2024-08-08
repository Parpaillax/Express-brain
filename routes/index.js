import express from "express";
import randomNumber from "../services/random-number.js";
import {tryNumber} from "../services/try-number.js";
import { ResultTypes } from '../enums/result-types.js'
import Leaderboards from "../models/Leaderboards.js";

const router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {user: req.session.user, playing: false});
})

router.post('/', async (req, res) => {
  const result = tryNumber(Number(req.body.attempt), req.session.rdnNum)
  console.log(req.session.rdnNum)

  if (result.resultType !== ResultTypes.CORRECT) {
    await Leaderboards.findOneAndUpdate({_id: req.session.leaderboardid}, {
      $inc: { attempt: 1 },
    })
    res.render('index', {result : result.text, playing: true})
  } else {
    req.session.numberToGuess = result.numberToFind;
    req.session.result = result.text;
    await Leaderboards.findOneAndUpdate({_id: req.session.leaderboardid}, {
      $inc: { attempt: 1 },
      $set: { endTime: Date.now() },
      numberToFind: result.numberToFind
    })
    res.redirect(`/win`);
  }
})

router.post('/play', async (req, res) => {
  if (req.session.user) {
    const leaderExist = await Leaderboards.findOne({user: req.session.user?._id, numberToFind: '?'})
    if (leaderExist) {
      req.session.leaderboardid = leaderExist._id;
    } else {
      const leader = await Leaderboards.create({
        user: req.session.user._id,
        attempt: 0,
        numberToFind: '?',
        startTime: Date.now(),
      })
      req.session.leaderboardid = leader._id
    }
  } else {
    const leader = await Leaderboards.create({
      user: null,
      attempt: 0,
      numberToFind: '?',
      startTime: Date.now(),
    })
    req.session.leaderboardid = leader._id
  }
  req.session.rdnNum = randomNumber.generate()
  res.render('index', {user: req.session.user, playing: true});
})

router.get('/restart', (req, res) => {
  req.session.rdnNum = randomNumber.generate(); // Générer un nouveau numéro
  req.session.numberToGuess = null;
  req.session.result = null;
  res.redirect('/');
});

router.get('/win', (req, res) => {
  req.session.rdnNum = null;
  res.render('win', {numberToGuess: req.session.numberToGuess, result: req.session.result})
})

export default router;
