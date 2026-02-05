const bcrypt = require('bcrypt');
exports.bcryptHash = async(password) => {
    return bcrypt.hash(password, 10);
}
exports.bcryptCompare=async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}