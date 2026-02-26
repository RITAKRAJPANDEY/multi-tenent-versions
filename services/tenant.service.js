const AppError = require("../errors/appError");
const { addTenantRepo } = require("../repositories/tenant.repo");
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