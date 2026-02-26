const {body}  = require('express-validator');
const validateTenant=[
    body('tenant').exists({checkNull:true}).withMessage('Tenant name can not be null').bail().isString().withMessage('Tenant name must be a string').bail().trim().notEmpty().withMessage('required field'),
    
]