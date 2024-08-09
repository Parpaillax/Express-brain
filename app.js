import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import flash from 'connect-flash';
import session from 'express-session';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter  from './routes/auth.js';
import teamsRouter from './routes/teams.js';
import leaderboardsRouter from './routes/leaderboards.js';
import protectedRouter from './routes/authentication_token.js';

import APITeamsRouter from './api/Teams_API.js'

import adminUser from './services/admin-user.js';

async function connect() {
  const uri = "mongodb://localhost:27017/games_db";
  await mongoose.connect(uri).then(() => {
    console.log('Connected!');
  }).catch((err) => {
    console.error(err);
  });
}

await connect();

const app = express()

dotenv.config();

adminUser.createAdmin()

app.use(express.static(path.join(process.cwd(), 'public')))

// view engine setup
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(
  session({
    secret: '!changeme!',
    saveUninitialized: true,
    resave: true,
  }),
)
app.use(flash())

app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')
  res.locals.user = req.session.user
  next()
})

// TODO : Créer le fichier routes/index.js ETAPE 1
// Définir les GET et POST pour la page d'accueil
// Dans ces routes, vous devez utiliser les fonctions de services/try-number.js et services/index.js
// pour gérer le jeu de devinette de nombre
app.use('/', indexRouter)

// TODO : Créer le fichier routes/users.js ETAPE 2
// Définir les routes suivantes :
// - GET /users ( page de liste des utilisateurs )
// - GET /users/create ( page de création d'un utilisateur )
app.use('/users', usersRouter)

// TODO : Créer le fichier routes/auth.js ETAPE 3
// Définir les routes GET /login et POST /login pour la connexion
// Définir les routes GET /logout pour la déconnexion
app.use('/auth', authRouter)
app.use('/protected', protectedRouter)

// TODO : Créer le fichier routes/team.js ETAPE 4
// Définir les routes GET /team et POST /team/new
app.use('/teams', teamsRouter)
app.use('/api/teams', APITeamsRouter)

//TODO: Créer le fichier routes/leaderboards ETAPE 5
app.use('/leaderboards', leaderboardsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app;
