const express = require('express');
const { createTenantController, addTenantEventsController } = require('../controllers/tenant.controller');
const router = express.Router();

router.post('/register',createTenantController);// add validator as well as assign an api key
router.post('/add/events',addTenantEventsController);
module.exports = router;