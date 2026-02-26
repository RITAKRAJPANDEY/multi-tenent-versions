const pool = require('../config/db');
exports.addTenantRepo = async (tenantname, apiKeyHash) => {
   const client = await pool.connect();
   try {
      await client.query(`BEGIN`);
      const tenantResult = await client.query(`INSERT INTO tenants (tname) VALUES ($1) RETURNING id,created_at,plan`, [tenantname]);

      const tenant = tenantResult.rows[0].id

      await client.query(`INSERT INTO api_keys (api_key_hash,tenant_id) VALUES ($1,$2) `, [apiKeyHash, tenant]);

      await client.query(`COMMIT`);
      return tenantResult.rows[0] || null;

   } catch (err) {
      client.query(`ROLLBACK`);
      throw err;
   } finally {
      client.release();
   }
}