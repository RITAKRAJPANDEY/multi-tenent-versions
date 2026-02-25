const pool = require('../config/db');

exports.addUserPassword = async (username, hashedPassword, role) => {
    try {
        const result = await pool.query(`INSERT INTO tenant_users (username,hpassword,role) VALUES ($1,$2,$3) RETURNING created_at,is_revoked`, [
            username,
            hashedPassword,
            role
        ]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}
exports.findUserByUsername = async (username) => {
    const result = await pool.query(`SELECT id,hpassword,is_revoked FROM tenant_users WHERE username = $1 LIMIT 1 `, [username]);
    return result.rows[0] || null;
}
exports.addRefreshHash = async (refresh_hash, user_id) => {
    const result = await pool.query(`INSERT INTO refresh_tokens (refresh_hash,user_id) VALUES ($1,$2) RETURNING created_at,expires_in `, [refresh_hash, user_id]);
    return result.rows[0] || null;
}
exports.findRefreshToken = async (refreshHash) => {
    const result = await pool.query(`SELECT revoked,expires_in,user_id FROM refresh_tokens WHERE refresh_hash = $1`, [refreshHash]);
    return result.rows[0] || null;
}
exports.revokeAllTokens = async (userId) => {
    const result = await pool.query(`UPDATE  refresh_tokens SET revoked = true WHERE user_id = $1`, [userId]);
    return result.rows[0] || null;
}
exports.revokeToken = async(refreshHash)=>{
    const result = await pool.query(`UPDATE refresh_token SET revoked = $1  WHERE refresh_hash=$2 RETURNING id`,[true,refreshHash]);
    return result.rows[0]||null;
}

exports.addNewRefreshToken = async (refreshHash, user_id, newRefreshHash) => {
    const client = await pool.connect();
    try {
        await client.query(`BEGIN`);
        const lockRes = await client.query(`SELECT id FROM refresh_tokens WHERE refresh_hash = $1 AND user_id = $2 FOR UPDATE`,[refreshHash, user_id]);

        if (lockRes.rowCount === 0) {
            throw new Error('INVALID_REFRESH_TOKEN');
        }

        const updateRes = await client.query(`UPDATE refresh_tokens SET revoked =$1 , replaced_with = $2 WHERE refresh_hash = $3   RETURNING id`, [true, newRefreshHash, refreshHash]);

        if (updateRes.rowCount === 0) {
            throw new Error('TOKEN_ALREADY_REVOKED');
        }

        const result = await client.query(`INSERT INTO refresh_tokens (refresh_hash,user_id) VALUES ($1,$2)`, [newRefreshHash, user_id]);

        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query(`ROLLBACK`);
        throw err;
    } finally {
        client.release();
    }
}
