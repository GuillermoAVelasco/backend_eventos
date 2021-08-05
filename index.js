const app = require('./app');
const port=process.env.PORT|| 8888;
const host=process.env.HOST||'0.0.0.0';

//Conexion Server.
app.listen(port,host,(req,res)=>{
    console.log('Servidor '+host+' escuchando puerto:'+port);
});