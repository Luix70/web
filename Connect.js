
var express = require("express");
var fs = require("fs");
var MongoClient = require("mongodb").MongoClient
var assert = require("assert");
var engines=require("consolidate");
var app=express();
var url = "mongodb://localhost:27017";
var urlServer ="http://localhost:3000/"

app.engine("html",engines.nunjucks);
app.set("view engine", "html");
app.set("views", __dirname+"/vistas");

app.use(express.static(__dirname)); //para poder referenciar las imagenes al directorio raiz

//vamos a leer el archivo .json y a introducirlo en la base de datos
//se ejecuta siempre que se pone en marcha el servidor
fs.readFile("listadoImagenes.json","utf8",(err,data)=>{

    assert.equal(null, err);

    MongoClient.connect(url,(err, conexion)=>{
        
        assert.equal(null, err);
        var db = conexion.db("dbImagenes");
        // Lo insertamos en la base de datos
        if (true){ // elimina el contenido de la tabla antes
            console.log("borrado");
            db.collection("imagenes").remove({});

        }

        var obData = JSON.parse(data);
        console.log("escritura");
        db.collection("imagenes").insert(obData.imagenes);

        conexion.close();

    });

});

app.get("/:coleccion",(req,res)=>{

     //se ejecuta siempre que se hace una llamada con un nivel de ruta
    var coleccion = req.params.coleccion;    
     MongoClient.connect(url,(err, conexion)=>{
         console.log("lectura");
         
         var db = conexion.db("dbImagenes");
         
         db.collection("imagenes").find({coleccion: new RegExp(".*" + coleccion.toUpperCase() + ".*","ig")}).toArray((err,docs)=>{
     
             
             
             res.render("listaImagenes",{"imagenes":docs,"busqueda":coleccion });
 
         });
         
         conexion.close();
     });
   

});

app.get("/:coleccion/:modelo",(req,res)=>{

    //se ejecuta siempre que se hace una llamada con dos niveles de ruta
   

    var coleccion = req.params.coleccion; 
    var modelo = req.params.modelo; 
    
    MongoClient.connect(url,(err, conexion)=>{
        console.log("lectura");
        
        var db = conexion.db("dbImagenes");
        
        db.collection("imagenes").find({modelo: new RegExp(".*" + modelo.toUpperCase() + ".*","ig")}).toArray((err,docs)=>{
    
            res.render("listaImagenes",{"imagenes":docs,"busqueda":modelo });

        });
        
        conexion.close();
    });
  

});


app.listen(3000,()=>{
    console.log("\n\n");
    console.log("te escucho en el puerto 3000");
    console.log("\n\n");
    console.log("Realiza una consulta usando el formato 'http://localhost:3000/{coleccion}/{modelo}'");
});



