const { verifyUserService, loginUserService } = require("../services/auth.service");
exports.verifyUserController = async (req, res, next) => {
    try {
        const data = await verifyUserService(req.body);
        res.status(200).json({ success: true,createdAt:data.created_at,revoked:data.revoked });
    } catch (err) {
        next(err);
    }
}
exports.loginUserController = async (req,res,next)=>{
    try{
      const user = await loginUserService(req.body);
      res.status(200).json({success:true,accessToken:user.accessToken,refreshToken:user.refreshToken});
    }catch(err){
        next(err);
    }
}