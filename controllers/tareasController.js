// Importar modelos
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

// Exportar funciones
exports.agregarTarea = async (req, res, next) => {
    // Obtener información del Proyecto
    const { url } = req.params;
    const proyecto = await Proyecto.findOne({
        where: {
            url
        }
    });

    // Obtener la tarea y definir los demás campos
    const { tarea } = req.body;
    const estado = 0;
    const ProyectoId = proyecto.id

    // Almacenar tarea en la BD
    const respuesta = await Tarea.create({ tarea, estado, ProyectoId });
    if (!respuesta) return next();

    // Redireccionar
    res.redirect(`/proyectos/${url}`);
};


exports.cambiarEstadoTarea = async (req, res, next) => {
    // Obtener id de la tarea
    const { id } = req.params;

    // Obtener tarea
    const tarea = await Tarea.findOne({
        where: {
            id
        }
    });

    // Cambiar estado
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    };
    tarea.estado = estado;

    // Intentar guardar cambio
    const respuesta = await tarea.save();
    if (!respuesta) return next();

    // Devolver mensaje
    res.status(200).send('Estado Actualizado.');
};

exports.eliminarTarea = async (req, res, next) => {
    // Leer de Query o Params
    const { id } = req.params

    // Eliminar de la BD
    const respuesta = await Tarea.destroy({
        where: {
            id
        }
    });
    if (!respuesta) return next();

    // Devolver Respuesta
    res.status(200).send('Tarea Eliminada Correctamente');
};