const { createTenantService, addtenantEventService, viewTenantEventService } = require("../services/tenant.service");

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
        const idempotency_key = req.get("X-Idempotency-Key");
        
        const {payload,type} = req.body;
        const body = req.body;
        const tenant = await addtenantEventService({tenant_id,idempotency_key,payload,type,body});
        res.status(201).json({success:true,event_created_at:tenant.created_at});
    } catch (err) {
        next(err)
    }
}
exports.viewTenantEventsController= async(req,res,next)=>{
    try{
       const tenant_id = req.client.tenant_id;
       const {type,from,to,cursor,limit} = req.body;
       const filters = {tenant_id,limit,type,from,to,cursor};
       const tenant = await viewTenantEventService(filters);
       res.status(200).json({success:true,cursor});
       
    }catch(err){
        next(err);
    }
 }  