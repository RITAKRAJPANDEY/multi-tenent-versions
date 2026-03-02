const express = require('express');
const { createTenantController, addTenantEventsController, viewTenantEventsController } = require('../controllers/tenant.controller');
const { tenantApiValidator } = require('../middlewares/tenant.apiKey.middleware');
const { validateTenant, validateTeantEvent } = require('../validator/tenant.validator');
const router = express.Router();

router.post('/register',validateTenant,createTenantController);// add validator as well as assign an api key
router.post('/add/events',validateTeantEvent,tenantApiValidator,addTenantEventsController);

router.get('/view/events',tenantApiValidator,viewTenantEventsController);
module.exports = router;