const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');

const authMiddleware = (req, res, next) => {
    const bearerAuth = req.headers.authorization;
    if (!bearerAuth || !bearerAuth.startsWith('Bearer ')) {
        res.status(403).json({
            msg: "no bearer!!!"
        })
    }
    const token = bearerAuth.split(' ')[1];
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (error) {
        res.status(403).json({});
    }
}
module.exports = authMiddleware;