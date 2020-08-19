// Importar modelos
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

// Exportar funciones
exports.proyectosHome = async (req, res) => {
    // Obtener Id del usuario
    const UsuarioId = res.locals.usuario.id;

    // Obtener todos los proyectos
    const proyectos = await Proyecto.findAll({
        where: {
            UsuarioId
        }
    });

    // Renderizar
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async (req, res) => {
    // Obtener Id del usuario
    const UsuarioId = res.locals.usuario.id;

    // Obtener todos los proyectos
    const proyectos = await Proyecto.findAll({
        where: {
            UsuarioId
        }
    });

    // Renderizar
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {
    // Obtener Id del usuario
    const UsuarioId = res.locals.usuario.id;

    // Obtener todos los proyectos
    const proyectos = await Proyecto.findAll({
        where: {
            UsuarioId
        }
    });

    // Validar nombre del proyecto
    const { nombre } = req.body;
    let errores = [];
    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    };

    // Intentar insertar en la BD
    if (errores.length > 0) {
        // Renderizar
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        });
    } else {
        try {
            // Obtener Id del usuario
            const UsuarioId = res.locals.usuario.id;

            // Almacenar en la BD
            await Proyecto.create({ nombre, UsuarioId });
            res.redirect('/');
        } catch (error) {
            console.log(error);
        };
    };
};

exports.proyectoURL = async (req, res, next) => {
    // Obtener Id del usuario
    const UsuarioId = res.locals.usuario.id;

    // Obtener todos los proyectos
    const proyectosPromise = Proyecto.findAll({
        where: {
            UsuarioId
        }
    });

    // Obtener información del proyecto a editar
    const { url } = req.params;
    const proyectoPromise = Proyecto.findOne({
        where: {
            url,
            UsuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([
        proyectosPromise, proyectoPromise
    ]);

    // Validar existencia del proyecto
    if (!proyecto) {
        return next();
    };

    // Consultar tareas del proyecto actual
    const tareas = await Tarea.findAll({
        where: {
            ProyectoId: proyecto.id
        }
    });

    // Renderizar
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
};

exports.formularioEditar = async (req, res) => {
    // Obtener Id del usuario
    const UsuarioId = res.locals.usuario.id;

    // Obtener todos los proyectos
    const proyectosPromise = Proyecto.findAll({
        where: {
            UsuarioId
        }
    });

    // Obtener información del proyecto a editar
    const { id } = req.params;
    const proyectoPromise = Proyecto.findOne({
        where: {
            id,
            UsuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([
        proyectosPromise, proyectoPromise
    ]);

    // Renderizar
    res.render('nuevoproyecto', {
        nombrePagina: 'Editar Proyecto',
        proyecto,
        proyectos
    });
};

exports.actualizarProyecto = async (req, res) => {
    // Obtener Id del usuario
    const UsuarioId = res.locals.usuario.id;

    // Obtener todos los proyectos
    const proyectosPromise = await Proyecto.findAll({
        where: {
            UsuarioId
        }
    });

    // Validar nombre del proyecto
    const { nombre } = req.body;
    let errores = [];
    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    };

    // Intentar insertar en la BD
    if (errores.length > 0) {
        // Renderizar
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        });
    } else {
        try {
            const { id } = req.params
            await Proyecto.update(
                { nombre },
                { where: { id } }
            );
            res.redirect('/');
        } catch (error) {
            console.log(error);
        };
    };
};

exports.eliminarProyecto = async (req, res, next) => {
    // Leer de Query o Params
    const { url } = req.params

    // Eliminar de la BD
    const respuesta = await Proyecto.destroy({
        where: {
            url
        }
    });
    if (!respuesta) return next();

    // Devolver Respuesta
    res.status(200).send('Proyecto Eliminado Correctamente');
};