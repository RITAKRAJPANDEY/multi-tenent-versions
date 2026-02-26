const { createTenantService, addtenantEventService } = require("../services/tenant.service");

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
        const tenant_id = req.client.tenant_id;
        const {payload,type} = req.body;
        const tenant = await addtenantEventService({tenant_id,payload,type});
        res.status(201).json({success:true,event_created_at:tenant.created_at});
    } catch (err) {
        next(err)
    }
}