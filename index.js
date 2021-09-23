// Importaciones
const express = require('express')
const app = express()
const expressFileUpload = require('express-fileupload')
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const secretKey = "1234"
//const path = require('path');
//const fs = require('fs');

const {
    inscribirSkater,
    traerSkaters,
    datosUsuarios,
    autentica,
    actualiza,
    borra,
} = require('./consultas')

//Server
app.listen(3000, () => console.log("Servidor encendido en puerto 3000. Escribir en browser localhost:3000"));


// Middlewares

app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"))
app.use("/img", express.static(__dirname + "/img"))
app.use("/css", express.static(__dirname + "/css"))

app.use(bodyParser.urlencoded({
    extended: true
}))
// o app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // (__dirname + "/public");
app.use(expressFileUpload({
    limits: {fileSize: 5000000},
    abortOnLimit: true,
    responseOnLimit:  "El tamaño de la imagen supera el límite permitido (5MB)"
}));

app.engine("handlebars",
    exphbs({
        defaultLayout: "Main",
        layoutsDir: `${__dirname}/views/components`
    }))
app.set("view engine", "handlebars")

//Rutas
//raiz. //cuando entre al localhost me va a llevar ahi:
app.get("/", (req, res) => {
    res.render("Index")
})
app.get("/registro", (req, res) => {      
    res.render("Registro")
})
//si no fuera con handlebar res.sendFile(__dirname + "/index.html")

/* *******************
    app.get( "/" ,  (req, res) => {
    res.render("Home");
  });
  
  app.post( "/login_user" ,  (req, res) => {
    res.render("Login_User", {layout: "Login_User"});
  });
  
  app.post( "/login_admin" ,  (req, res) => {
    res.render("Login_Admin", {layout: "Login_Admin"});
  });
  
  app.get( "/register" ,  (req, res) => {
    res.render("Register", {layout: "Register"});
  }); 
  *****************
  */

//login get. 
app.get("/login", async (req, res) => {
    res.render("Login")
})
//traer los skaters
app.get("/ingresos", async (req, res) => {
    const registros = await traerSkaters()
    res.send(registros)
})

/* //API
//subir imagen skater
app.post( "/api_upload_image" , async (req, res) => {
    let foto = req.files.myFile;
    console.log(__dirname,'/public/img') 
    foto.mv(__dirname+'/public/imag/'+foto.name, (err) => {
      if (err) {console.log(err.code);}
      else {console.log("imagen almacenada");}
    });
  }); */


// por POST skater. //signup skater and image
app.post("/skaterprofile", async (req, res) => {


//Datos

    let email = req.body.email;
    let nombre = req.body.nombre;
    let pw2 = req.body.pw2;
    let experiencia = req.body.experiencia;
    let especialidad = req.body.especialidad;

        /*   let user_image = req.body.user_image;
        let r = await InscribirSkater(nombre,telefono,email,pass,user_image);
        if (r!=''){
            res.json({respuesta:"Correcta"})
        }
    }); */

//foto. similar a repositorio M8APIREST(ver).  adicional ver HTMLNODECRUD
    let { fotoSkater } = req.files  //fotoSkater  porque es <input type="file" name="fotoSkater" />  en el registro handlebar /simil a repo collage htmlcrud
    let {name} = fotoSkater  //name porque es name en target_file cuando se ve el console.log //let porque quiero que cambie. no usar const porque no es una constante
    console.log(req.files);

    fotoSkater.mv(`${__dirname}/public/img/${name}`, (err) => {
        if (err) return res.status(500).send({
            error: `Error en consulta ${err}`,
            code: 500
        })
    });

    //exito solicitud
    try {
        const registro = await inscribirSkater(email, nombre, pw2, experiencia, especialidad, name)
        res.status(201).render("Login");
        // 201 ok request.created

    //fallo
    } catch (error) {
        res.status(500).send({
            error: `Error en consulta ${error}`,
            code: 500
        })
    }
});


app.get("*", (req, res) => {
    res.send("Ruta invalida")
});