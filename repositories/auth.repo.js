const pool = require('../config/db');

exports.addUserPassword= async(username,hashedPassword,role)=>{
    try{
    const result = await pool.query(`INSERT INTO tenant_users (username,hpassword,role) VALUES ($1,$2,$3) RETURNING created_at,is_revoked`,[
       username,
       hashedPassword,
       role 
    ]);
    return result.rows[0];
}catch(err){
    throw err;
}
}
exports.findUserByUsername=async(username)=>{
    const result = await pool.query(`SELECT id,hpassword,is_revoked FROM tenant_users WHERE username = $1 LIMIT 1 `,[username]);
    return result.rows[0]||null;
}
exports.addRefreshHash=async(refresh_hash,user_id)=>{
    const result = await pool.query(`INSERT INTO refresh_tokens (refresh_hash,user_id) VALUES ($1,$2) RETURNING created_at,expires_in `,[refresh_hash,user_id]);
    return result.rows[0]||null;
}