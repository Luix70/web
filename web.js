
var express = require("express");
//var engines=require("consolidate");
var app=express();


// app.engine("html",engines.nunjucks);
// app.set("view engine", "html");
// app.set("views", __dirname+"/vistas");

app.use(express.static(__dirname)); //para poder referenciar las imagenes al directorio raiz

//vamos a leer el archivo .json y a introducirlo en la base de datos
//se ejecuta siempre que se pone en marcha el servidor


// app.get("/",(req,res)=>{
//   //res.sendFile(__dirname + "/index.html");
//   //res.send("Hello");
// });


app.listen(1080,()=>{
    
    console.log("te escucho en el puerto 1080");

    
});



