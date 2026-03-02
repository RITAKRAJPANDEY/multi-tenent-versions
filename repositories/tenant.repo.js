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

exports.findTenantByApiKey= async(apiKeyHash)=>{
   const result = await pool.query(`SELECT tenant_id,revoked_at FROM api_keys WHERE api_key_hash = $1`,[apiKeyHash]);
   return result.rows[0]||null;
}

exports.addTenantEventRepo=async(tenant_id,type,payload)=>{
   const result = await pool.query(`INSERT INTO tenant_events (tenant_id,type,payload) VALUES ($1,$2,$3) RETURNING created_at `,[tenant_id,type,payload]);
   return result.rows[0]||null;
}
exports.viewTenantEventRepo = async({tenant_id,filters,limit,cursor})=>{
   const values =[tenant_id];
   const conditions =[];
   let index=2;
   let query=`SELECT * FROM tenant_events WHERE tenant_id = $1 `;
   if(filters.type){
      conditions.push(` type = $${index++}`);
      values.push(filters.type);
   }
   if(filters.from&&filters.to){
      conditions.push(`created_at >= $${index++}::timestamptz AND created_at <= $${index++}::timestamptz `);
      values.push(filters.from,filters.to);
   }
   if(cursor){
      conditions.push(` (created_at,id) <($${index++}::timestamptz ,$${index++})`);
      values.push(cursor.created_at,cursor.id);
   }
   if(conditions.length){
   query+=` AND ${conditions.join(" AND ")}`
   }
   query+=`ORDER BY created_at DESC id DESC LIMIT $${index++}`;
   values.push(limit);
   const result = await pool.query(query,values);
   return result.rows||null;
}