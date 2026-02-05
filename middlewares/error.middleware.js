
module.exports = (err,req,res,next)=>{
    const statusCode = err.statusCode||500;
    const status = statusCode>=500?"error":"fail";
    console.log(err);
    
    res.status(statusCode).json({
        success:false,
        status,
        message:err.isOperational?err.message:"Internal Server Error",
        error:err.error||null,
        
    })
}