const AppError = require("../errors/appError");
const { addUserPassword, findUserByUsername, addRefreshHash, findRefreshToken, revokeAllTokens, addNewRefreshToken, revokeToken } = require("../repositories/auth.repo");
const { bcryptHash, bcryptCompare } = require("../utils/bcrypt.util");
const { genRandomBytes, cryptoHash } = require("../utils/crypto.util");
const { genAccessToken } = require("../utils/jwt.util");

exports.verifyUserService = async ({ username, password, role }) => {
   try {
      const hashedPassword = await bcryptHash(password);
      const user = await addUserPassword(username, hashedPassword, role);
      return { created_at: user.created_at, revoked: user.is_revoked };
   } catch (err) {
      if (err.code === '23505') {
         throw new AppError("User Already Exists", 409);
      }
      throw err;
   }
}
exports.loginUserService = async ({ username, password }) => {

   const user = await findUserByUsername(username);
   if (!user) {
      throw new AppError('unauthorized', 401);
   }
   if (user.is_revoked) {
      throw new AppError('user has been revoked', 403);//forbidden user
   }
   //later add tenant for the payload as rn we haven't created a foreign key it's not possible make sure to do it later

   const isValid = await bcryptCompare(password, user.hpassword);
   if (!isValid) {
      throw new AppError('unauthorized', 401);
   }
   const refreshToken = genRandomBytes();
   const refresh_hash = cryptoHash(refreshToken);
   try {
      const addRefresh_hash = await addRefreshHash(refresh_hash, user.id);
      if (!addRefresh_hash) {
         throw new AppError('session creataion failed',500)
      }
   } catch (err) {
      console.error(err);
      throw new AppError('session creation failed',500)
      
   }
   const accessToken = genAccessToken(user.id, user.role);//user.tenant_id
   return { accessToken: accessToken, refreshToken: refreshToken,is_revoked:user.is_revoked}
}
exports.refreshUserService=async({refreshToken})=>{
   const refreshHash=cryptoHash(refreshToken);
   try{
   const user = await findRefreshToken(refreshHash);// search -> revoked -> new tokens ->return
   if(!user){
      throw new AppError('Unauthorized',401);
   } 
   if(user.revoked){
	   await revokeAllTokens(user.user_id);
      throw new AppError('Forbidden',403);
   }
   if(new Date(user.expires_in).getTime()<Date.now()){ // psql data is in string so make sure that you convert it first 
	throw new AppError('Unauthorized',401);
   }
   const newRefreshToken= genRandomBytes();
   const newRefreshHash=cryptoHash(newRefreshToken);

   await addNewRefreshToken(refreshHash,user.id,newRefreshHash);// make a atomic transaction which revokes previous refreshtoken and adds the new one 
   const newAccessToken =  genAccessToken(user.user_id,)
   return{refreshToken:newRefreshToken,accessToken:newAccessToken}
}catch(err){
   if(err.message==='INVALID_REFRESH_TOKEN'){
      throw new AppError('Unauthorized',401);
   }
   if(err.message==='TOKEN_ALREADY_REVOKED'){
      throw new AppError('Forbidden',403);
   }
   throw err;
}
}
exports.logoutUserService= async({refreshToken})=>{
   const refreshHash = cryptoHash(refreshToken);
   const revoke = await revokeToken(refreshHash);
   if(!revoke){
      throw new AppError('Unauthorized',401);
   }
}