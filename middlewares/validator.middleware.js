const { validationResult } = require('express-validator');
const AppError = require('../errors/appError');

exports.userAuthValidationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new AppError('invalid user input',400);
        err.errors = errors.array();
        return next(err);
    }
    next();
}

