import express from "express";
import {body, validationResult} from "express-validator";
import argon2 from 'argon2';
import Users from "../models/Users.js"

const router = express.Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (user?.role !== 'admin') {
    res.status(403).render('error', {message: "vous n'avez pas les droits", error: {status: 403, stack: '??'}});
  } else {
    const allUsers = await Users.find();
    res.render('user/users', {users:allUsers});
  }
})

router.get('/new', (req, res) => {
  res.render('auth/newUser');
})

router.post('/new',
  body('nickName').isLength({min: 1}).withMessage('Pseudo invalide').custom(async value => {
    const nickName = await Users.findOne({nickName: value});
    if (nickName) {
      throw new Error('Pseudo déjà existant')
    }
  }),
  body('email').isEmail().notEmpty().withMessage('Email invalide'),
  body('email').custom(async value => {
    const email = await Users.findOne({email: value})
    if (email) {
      throw new Error('Email déjà existante');
    }
  }),
  body('password').isLength({min: 4}).withMessage('Le mot de passe doit faire au moins 4 caractères'),
  body('confirmPassword').custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe doivent être similaire')
    }
  }),
  async function (req, res) {
  const nickName = req.body.nickName;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/newUser', {errors: errors.array()});
  } else {
    const hashPassword = await argon2.hash(password)
    Users.create({
      email: email,
      password: hashPassword,
      nickName: nickName,
    })
    res.redirect('/auth/login');
  }
})

export default router;
