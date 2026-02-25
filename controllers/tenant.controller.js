exports.createTenantController = async(req,res,next)=>{
    const tenant = await createTenantService(req.body);
    res.status(201).json({success:true});
}