import { validationResult } from 'express-validator';

export default function checkInputData(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: { message: `Invalid format data`, details: errors.array() } });
        return false;
    }

    return true;
}