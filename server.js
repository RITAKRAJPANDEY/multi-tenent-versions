require('dotenv').config();
const express = require('express');
const app = express();
const authRout = require('./routers/auth.rout')
const tenantRout = require('./routers/tenant.rout');
app.use(express.json());
app.use('/tenant',tenantRout);
app.use('/user',authRout);
app.use(require('./middlewares/error.middleware'));
const PORT = process.env.SERVER_PORT||3000;
app.listen(PORT,()=>{
    console.log(`Listening at port ${PORT}...`);
});