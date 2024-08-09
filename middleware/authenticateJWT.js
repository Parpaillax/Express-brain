import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET;
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)
  if (!token) return res.status(403).json({ message: 'Accès interdit, token manquant' });

  try {
    req.user = jwt.verify(token, SECRET); // Ajouter les informations utilisateur à la requête
    next(); // Passer à la route suivante
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export default authenticateJWT