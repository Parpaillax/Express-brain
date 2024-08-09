import express from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = express.Router();

router.get('/auth/login', authenticateJWT, (req, res) => {
  res.redirect('/');
});

export default router;
