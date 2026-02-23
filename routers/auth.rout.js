const express = require('express');
const router = express.Router();
const { verifyUserController, loginUserController } = require('../controllers/auth.controller');
const { validateUserAuth } = require('../validator/userValidator');
const { userAuthValidationMiddleware } = require('../middlewares/validator.middleware');
router.post('/verify',validateUserAuth,userAuthValidationMiddleware,verifyUserController);
router.post('/login',validateUserAuth,userAuthValidationMiddleware,loginUserController)
module.exports = router;