const AppError = require('../errors/appError');
const { findTenantByApiKey } = require('../repositories/tenant.repo');
const { cryptoHash } = require('../utils/crypto.util');
exports.tenantApiValidator=async(req,res,next)=>{
    try{
        const authHead = req.header('X-API-Key');
        if(!authHead){
            throw new AppError ('Unauthorized',401);
        }
        const authKeyHash = cryptoHash(authHead);
        const tenant = await findTenantByApiKey(authKeyHash);
        if(!tenant){
            throw new AppError('Unauthorized',401);
        }
        if(tenant.revoked_at!==null){
            throw new AppError('Unauthorized',401);
        }
        const client = {
                tenant_id:tenant.tenant_id
        }
        req.client = client;
        next();
    }catch(err){
        console.error(err);
        throw err;
    }
}