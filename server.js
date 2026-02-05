const express = require('express');
const app = express();
app.use(express.json());









app.use(require('./middlewares/error.middleware'));
app.listen(3000,()=>{
    console.log('Listening at port 3000...');
});