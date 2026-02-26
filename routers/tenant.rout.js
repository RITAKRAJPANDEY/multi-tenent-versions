const express = require('express');
const { createTenantController } = require('../controllers/tenant.controller');
const router = express.Router();

router.post('/register',createTenantController);// add validator as well as assign an api key
module.exports = router;