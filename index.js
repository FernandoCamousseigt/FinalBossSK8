// Importaciones

const express = require ( "express" );
const path = require('path');
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = '1234';

const {
    ingresarUsuario,
    traerUsuarios,
    datosUsuario,
    autenticacion,
    actualizacion,
    eliminacion,
} = require('./consultas')

//Server
app.listen(3000, () => console.log("Servidor encendido en puerto 3000"));

// Middlewares 

app.use("/img", express.static(__dirname + "/img"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));  //o bien podria ser (__dirname + "/public");
app.use(
  expressFileUpload({
  limits: 5000000,
  abortOnLimit: true,
  responseOnLimit: "El tamaño de la imagen supera el límite permitido (5MB)",
  })
  );

app.engine(
    "handlebars",
    exphbs({
    defaultLayout: "Index",
    layoutsDir: `${__dirname}/views`,
    })
    );
app.set("view engine", "handlebars");


//Rutas

app.get( "/" ,  (req, res) => {
    res.render("Index");
  });

/* //o podria ser con async como: 
app.get('/', async (req, res) => {
    const skaters = await traerUsuarios();
    res.render('Index', {skaters}); */

app.get("/registro", (req, res) => {
    res.render("Registro")
});


//inicio de sesion
app.get("/login", async (req, res) => {
    res.render("Login")
});

