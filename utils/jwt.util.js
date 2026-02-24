const jwt = require('jsonwebtoken');
const SECRET =process.env.ACCESSTOKENSECRET;
exports.genAccessToken=(sub,role)=>{
    return jwt.sign({sub:sub,role:role},SECRET,{expiresIn:'15m'});
}
exports.verifyAccessToken=(token)=>{
    try{
    return jwt.verify(token,SECRET);
    }catch(err){
     console.error(err);
     return null;
    }
}// improve later to retain the error for better status code