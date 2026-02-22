const AppError = require("../errors/appError");
const { addUserPassword } = require("../repositories/auth.repo");
const { bcryptHash } = require("../utils/bcrypt.util")

exports.verifyUserService=async({username,password,role})=>{
   try{
   const hashedPassword = await bcryptHash(password);
   const user = await addUserPassword(username,hashedPassword,role);
   return {created_at:user.created_at,revoked:user.is_revoked};
   }catch(err){
      if(err.code==='23505'){
         throw new AppError("User Already Exists",409);
      }
      throw err;
   }
}
exports.loginUserService = async({username,password})=>{
   
}
