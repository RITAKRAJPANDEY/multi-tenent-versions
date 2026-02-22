const express = require('express');
const router = express.Router();
const { verifyUserController } = require('../controllers/auth.controller');
router.post('/verify',verifyUserController);
router.post('/login',)
module.exports = router;