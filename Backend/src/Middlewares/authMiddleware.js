const jwt = require('jsonwebtoken');
const Config = require('@/Config/env');


const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer", "").trim();

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, Config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = authMiddleware;