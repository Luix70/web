var express = require("express");
var fs=require("fs");
var app=express();
var https = require ("https");

var port = 80;
var sPort = 443;

if (NODE_ENV =  "development") {
    port = 1080;
    sPort=1443
}

app.use(express.static(__dirname)); //para poder referenciar las imagenes al directorio raiz
app.listen(port,()=>{
    console.log(`te escucho en el puerto ${port}`);
});



var httpsOptions={
    key: fs.readFileSync("./https/key_io.pem"),
    cert:  fs.readFileSync("./https/cert_io.pem")
}
https.createServer(httpsOptions , app).listen(sPort,()=>{
    console.log(`Escuchando (https) en el puerto: ${sPort}`)
})
