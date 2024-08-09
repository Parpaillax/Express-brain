export default function sendNotFound(res, id, kind = "Goose") {
    return res.status(404).json({ error: { message: `${kind}(${id}) not found` } });
}