var express = require("express");
var app=express();
app.use(express.static(__dirname)); //para poder referenciar las imagenes al directorio raiz
app.listen(1080,()=>{
    console.log("te escucho en el puerto 1080");
});



