import express from 'express';
import Teams from '../models/Teams.js';
import sendNotFound from "./tools/sendNotFound.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import {body} from "express-validator";
import checkInputData from "./tools/checkInputData.js";

const router = express.Router();

router.get('/', (req, res) => {
  const allTeams = Teams.find();
  res.json(allTeams)
})

router.get('/:id', async (req, res) => {
  const oneTeam = Teams.findById(req.params.id);
  if (!oneTeam) {
    return sendNotFound(res, req.params.id, 'Team');
  }

  res.json(oneTeam);
})

router.post('/', authenticateJWT,
  body('name').isLength({min:1}),
  body('member').isArray({min: 2}),
  async (req, res) => {

    const checkData = checkInputData(req, res)
    if (!checkData) return;

    const team = await Teams.create({
      name: req.body.name,
      members: req.body.member,
    });

    res.json(team)
})

router.put('/:id', authenticateJWT,
  body('name').optional().isLength({min:1}),
  body('member').optional().isArray({min: 2}),
  async (req, res) => {

    const checkData = checkInputData(req, res)
    if (!checkData) return;

    const team = await Teams.findById(req.params.id);
    if (!team) {
      return sendNotFound(res, req.params.id, 'Team')
    }

    team.$set(req.body);
    await team.save();
    res.json(team);
});



export default router;
