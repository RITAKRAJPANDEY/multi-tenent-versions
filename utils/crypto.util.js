const crypto = require('crypto');
exports.genRandomBytes=()=>{
    return crypto.randomBytes(32).toString('hex');
}
exports.cryptoHash=(refreshToken)=>{
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
}