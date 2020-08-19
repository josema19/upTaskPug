// Importar librerías
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const conexionDB = require('./config/conexion');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env' });

// Definir Conexión a la BD
conexionDB();

// Definir servidor de express
const app = express();

// Archivos státicos
app.use(express.static('public'));

// Habilitar Vistas y su ruta
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// Habilitar body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Agregar Flash Message
app.use(flash());

// Habilitar cookieParser
app.use(cookieParser());

// Habilitar sesiones para navegar entre distintas páginas
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

// Habilitar Passport para autenticación
app.use(passport.initialize());
app.use(passport.session());

// Pasar funciones de adicionales (VARDUMP, Flash, Usuario)
app.use((req, res, next) => {
    res.locals.varDump = helpers.varDump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
});

// Habilitar rutas
app.use('/', routes());

// Ejecutar servidor
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
    console.log('El servidor está funcionando');
});