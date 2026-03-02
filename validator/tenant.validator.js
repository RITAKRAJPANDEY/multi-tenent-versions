const {body}  = require('express-validator');
exports.validateTenant=[
    body('tenantname').exists({checkNull:true}).withMessage('Tenant name can not be null').bail().isString().withMessage('Tenant name must be a string').bail().trim().notEmpty().withMessage('required field')
]
exports.validateTeantEvent =[
    body('payload').exists({checkNull:true}).withMessage('payload  is required').bail().isObject().withMessage('payload must be jsonb').bail(),

    body('type').exists({checkNull:true}).withMessage('type is required').bail().isString().withMessage('type must be a string').bail().trim().notEmpty().withMessage('type must not be empty')
]