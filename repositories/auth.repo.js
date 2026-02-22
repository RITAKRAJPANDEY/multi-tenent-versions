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