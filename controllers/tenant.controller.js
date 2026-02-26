const { createTenantService } = require("../services/tenant.service");

exports.createTenantController = async (req, res, next) => {
    try {
        const tenant = await createTenantService(req.body);
        res.status(201).json({ success: true, id: tenant.id, apiKey: tenant.apiKey });
    } catch (err) {
        next(err);
    }
}

exports.addTenantEventsController = async (req, res, next) => {
    try {
        const tenant = await addtenantEventsService(req.body);
        res.status(201).json({success:true});
    } catch (err) {
        next(err)
    }
}