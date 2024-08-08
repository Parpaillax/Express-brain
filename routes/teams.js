import express from "express";
import {body, validationResult} from "express-validator";
import Teams from "../models/Teams.js";
import Users from "../models/Users.js"

const router = express.Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (user?.role !== 'admin') {
    res.status(403).render('error', {message: "vous n'avez pas les droits", error: {status: 403, stack: '??'}});
  } else {
    const allTeams = await Teams.find().populate('members', 'nickName');
    res.render('team/teams', {teams: allTeams});
  }
})

router.get('/new', async (req, res) => {
  const allUsers = await Users.find();
  res.render('team/newTeams', {users: allUsers});
})

router.post('/new',
body('name').isLength({min:1}).withMessage("Il faut un nom d'équipe").custom(async value => {
  const name = await Teams.findOne({name: value})
  if (name) {
    throw new Error("Nom d'équipes déjà utilisé")
  }
}),
body('member').isArray({min: 2}).withMessage("Il faut au moins 2 joueurs dans l'équipe"),
async (req, res) => {
  const teamName = req.body.name;
  const members = req.body.member;
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const allUsers = await Users.find();
    return res.status(422).render('team/newTeams', {errors: errors.array(), users: allUsers})
  }

  Teams.create({
    name: teamName,
    members: members,
  })
  res.redirect('/teams');
})

export default router;
