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
    setUsuarioStatus,
    autenticar,
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

//login get. 
app.get("/login", async (req, res) => {
    res.render("Login")
})
//traer los skaters
app.get("/ingresos", async (req, res) => {
    const registros = await traerSkaters()
    res.send(registros)
})

//ADMIN
//al entrar a localhost:3000/Admin
app.get("/admin", async (req, res) => {
    try {
        const usuarios = await traerSkaters()
        res.render("Admin", {usuarios});
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

//cambiar estado a usuarios. 
app.put("/usuarios", async (req, res) => {
    const {id, estado} = req.body
    try {
        const usuario = await setUsuarioStatus(id, estado)
        res.status(200).send(JSON.stringify(usuario))
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }
})

// inscribir skater. //signup skater and image //
app.post("/skaterprofile", async (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send("No se encontro ningun archivo")
    };


//Datos

    let email = req.body.email;
    let nombre = req.body.nombre;
    let pw2 = req.body.pw2;
    let experiencia = req.body.experiencia;
    let especialidad = req.body.especialidad;

    console.log("email", email);   //comprobar que llegan datos
    console.log("nombre", nombre);
    console.log("pw2", pw2);
    console.log("experiencia", experiencia);
    console.log("especialidad", especialidad);

       
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



//Verify de email y password 
app.post("/autenticar", async function (req, res) {
    const { email, password} = req.body
    const user = await autenticar(email, password);
    if (user.email) {
        if (user.estado) {
            const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 180,
                    data: user
                },
                secretKey
            );
            res.send(token)
        } else {
            res.status(401).send({
                error: "Este usuario aún no ha sido validado",
                code: 401
            })
        }
    } else {
        res.status(404).send({
            error: "Este usuario no está registrado en la base de datos",
            code: 404
        });
    }
});


//Datos (evidencias)
app.get("/datos", function (req, res) {
    const {token} = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
        const { data } = decoded
        const {id, email, nombre, password, especialidad, anos_experiencia } = data
        err 
            ? res.status(401).send(
                res.send({
                    error: "401 No autorizado",
                    message: "Usted no está autorizado para entrar aquí",
                    token_error: err.message
                })
            ) 
            : res.render("Datos", {
                id, email, nombre, password, especialidad, anos_experiencia
            });
    });
});


// boton actualizar datos usuario   
app.put("/actualiza", async (req, res) => {
    const { id, nombre, password2, experiencia, especialidad } = req.body
    console.log("id", id);   //comprobar datos
    console.log("nombre", nombre);
    console.log("password2", password2);
    console.log("experiencia", experiencia);
    console.log("especialidad", especialidad);

    try {
        const result = await actualiza(id, nombre, password2, experiencia, especialidad)
        console.log(result)
        res.status(200).render("Index")

    } catch (e) {
        res.status(500).send({
            error: `Algo salio mal... ${e}`,
            code: 500
        })
    }
})
 app.delete("/eliminarcuenta", async (req, res) => {   
    let {id} = req.body.source
 
  try { 
        const registro = await borra(id)
        res.status(200).render("Index")
        
    }  catch (e) {
        res.status(500).send({
            error: `Algo salio mal ${e}`,
            code: 500
        })
    } 
}) 


//otra ruta
app.get("*", (req, res) => {
    res.send("Ruta invalida")
});
