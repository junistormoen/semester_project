import jwt from "jsonwebtoken";

function decodeToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Manglende token. Autentisering kreves.' });
    }

    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        req.user = decodedToken.userid;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Ugyldig token. Autentisering mislyktes.' });
    }
}

export default decodeToken;