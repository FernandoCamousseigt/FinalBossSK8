// Importaciones

const express = require ( "express" );
//const path = require('path');
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
//const fs = require('fs');
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
app.use(express.static("public"));  // (__dirname + "/public");
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
    defaultLayout: "Main",
    layoutsDir: `${__dirname}/views/components`,
    })
    );
app.set("view engine", "handlebars");


//Rutas

app.get( "/" ,  (req, res) => {
    res.render("Index");
  });

/* //o podria ser con async, algo como: 
app.get('/', async (req, res) => {
    const skaters = await traerUsuarios();
    res.render('Index', {skaters}); */

    //registrar usuario en base datos
app.get("/registro", (req, res) => {
    res.render("Registro")
});

app.post('/skater', async (req, res) => {

  let email = req.body.email;
    let nombre = req.body.nombre;
    let pw2 = req.body.pw2;
    let experiencia = req.body.experiencia;
    let especialidad = req.body.especialidad;

/*   let user_image = req.body.user_image;
    let r = await InsertarUsuario(nombre,telefono,email,pass,user_image);
    if (r!=''){
         res.json({respuesta:"Correcta"})
    }
  }); */

    //const skaterDatos = req.body; 
    //console.log(skaterDatos);
    let { fotoSkater } = req.files;
    let {name} = fotoSkater;


    fotoSkater.mv(`${__dirname}/public/img/${name}`, async (error, data) => {
        if (error) res.status(500).send('Error al cargar imagen', error);
        try {
            const agregarSkater = await ingresarUsuario(email, nombre, pw2, experiencia, especialidad, name);
            res.status(201).render("Login");
            res.status(201).send(agregarSkater);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                error: `Error ${error}`,
                code: 500
            })
        }
    });
});




//inicio sesion
app.get("/login", async (req, res) => {
    res.render("Login")
});


//listado skaters
app.get("/listado", async (req, res) => {
    const lista = await traerUsuarios()
    res.send(lista)
});


app.get("*", (req, res) => {
    res.send("Ruta invalida")
})
