const jwt = require('jsonwebtoken');
exports.genAccessToken=(sub,role)=>{
    return jwt.sign({sub:sub,role:role},process.env.ACCESSTOKENSECRET,{expiresIn:'15m'});
}