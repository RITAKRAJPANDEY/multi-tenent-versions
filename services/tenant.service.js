const AppError = require("../errors/appError");
const { addTenantRepo, addtenantEventRepo } = require("../repositories/tenant.repo");
const { genRandomBytes, cryptoHash } = require("../utils/crypto.util");

exports.createTenantService=async({tenantname})=>{
    try{
        const apiKey =genRandomBytes();
        const apiKeyHash=cryptoHash(apiKey);
        const tenant = await addTenantRepo(tenantname,apiKeyHash);
        return {current_plan:tenant.plan,created_at:tenant.created_at,id:tenant.id,apiKey:apiKey};
    }catch(err){
        if(err.code==='23505'){
            throw new AppError('tenant already exists',409);
        }
        console.error(err);
    }
}

exports.addtenantEventService=async({payload,type,tenant_id})=>{
    try{
   const event = await addtenantEventRepo(tenant_id,type,payload);
   return {created_at:event.created_at};
    }catch(err){
        console.error(err);
        throw new AppError('Unable to Add Event',404)
    }
}