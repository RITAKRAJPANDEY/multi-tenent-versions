
const AppError = require('../errors/appError');
const { verifyAccessToken } = require('../utils/jwt.util');
exports.authenticateMiddleware = (req, res, next) => {
    const authHead = req.headers.authorization;
    if (!authHead || !authHead.startsWith("Bearer ")) {
        throw new AppError('Unauthorized', 401);
    }
    const token = authHead.split(" ")[1];
    if (!token) {
        throw new AppError('Unauthorized', 401);
    }
    const decoded = verifyAccessToken(token);
    if (!decoded) {
        throw new AppError('Unauthorized', 401)
    }
    const client = {
        id: decoded.sub,
        role: decoded.role
    }
    req.client = client;
    next();
}