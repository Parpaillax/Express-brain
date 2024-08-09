import jwt from "jsonwebtoken";
import extractBearerToken from "./extractBearerToken.js";

export default async function checkTokenMiddleware(req, res, next) {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    if (!token) {
        return res.status(401).json({ error: { message: 'Need a token' } })
    }

    jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            return res.status(401).json({ error: { message: 'Bad token' } })
        }

        return next()
    })
}