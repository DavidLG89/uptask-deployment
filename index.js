const express = require("express");
const routes = require("./routes");
const path = require("path");
const flash = require('connect-flash');
const session =require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importar las variables
require('dotenv').config({path: 'variables.env'});

//helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexion a BD
const db = require('./config/db');

//importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

// crear la app de express
const app = express();
//Cargar los archivos estaticos
app.use(express.static("public"));

// habilitar pug
app.set("view engine", "pug");

//habilitar bodyParser para leer datos del formulario
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Añadir la carpeta de las vistas
app.set("views", path.join(__dirname, "./views"));

app.use(cookieParser());

//sesiones permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//agregar flash messages
app.use(flash());

//Pasar vardump a la aplicacion
app.use((req,res, next)=> {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use("/", routes());

app.listen(3000);

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('Elservidor esta func');
});