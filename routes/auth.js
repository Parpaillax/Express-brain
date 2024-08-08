import express from "express";
import argon2 from 'argon2';
import Users from '../models/Users.js'

const router = express.Router();

router.get("/login", async (req, res) => {
  res.render("auth/login");
})

router.post('/login',async (req, res) => {
  const user = await Users.findOne({email: req.body.email})
  const isGoodPassword = user?.password && await argon2.verify(user?.password, req.body.password)

  if (!user || !isGoodPassword) {
    return res.render('auth/login', {
      error: 'Email ou mot de passe incorrect',
      email: req.body.email,
    })
  }
  req.session.user = user;
  res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login')
})

export default router;
