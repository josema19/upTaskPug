// Importar librerías
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const { Router } = require('express');

// Exportar módulo de rutas
module.exports = function () {
    // Ruta Home
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    // PROYECTOS------------------------------------------------
    // Crear
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoURL
    );

    // Actualizar
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // Eliminar
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // TAREAS------------------------------------------------
    // Crear
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    // Actualizar estado
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // USUARIOS------------------------------------------------
    // Crear
    router.get('/crear-cuenta',
        usuariosController.formularioCrearCuenta
    );
    router.post('/crear-cuenta',
        usuariosController.crearCuenta
    );
    router.get('/confirmar/:email',
        usuariosController.confirmarCuenta
    );

    // SESIÓN------------------------------------------------
    router.get('/iniciar-sesion',
        usuariosController.formularioIniciarSesion
    );
    router.post('/iniciar-sesion',
        authController.autenticarUsuario
    );
    router.get('/cerrar-sesion',
        authController.cerrarSesion
    );

    // RESTABLECER CONTRASEÑA-----------------------------------
    router.get('/restablecer',
        usuariosController.formularioRestablecerPassword
    );
    router.post('/restablecer',
        authController.enviarToken
    );
    router.get('/restablecer/:token',
        authController.validarToken
    );
    router.post('/restablecer/:token',
        authController.actualizarPassword
    );

    return router;
};