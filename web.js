
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


app.get("/",(req,res)=>{
    res.render("index.html");
});


app.listen(80,()=>{
    
    console.log("te escucho en el puerto 80");

    
});



