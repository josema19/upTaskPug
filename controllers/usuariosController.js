// Importar librerías
const enviarEmail = require('../handlers/email');

// Importar modelos
const Usuario = require('../models/Usuario');

// Exportar funciones
exports.formularioCrearCuenta = (req, res) => {
    // Renderizar
    res.render('crearcuenta', {
        nombrePagima: 'Crear Cuenta en Uptask'
    });
};

exports.crearCuenta = async (req, res) => {
    // Obtener datos
    const { email, password } = req.body

    // Intentar insertar en la BD
    try {
        // Crear usuario
        await Usuario.create({ email, password });

        // Crear url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Crear objeto de usuario
        const usuario = {
            email
        };

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmarcuenta'
        });

        // Redireccionar
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        // Renderizar
        res.render('crearcuenta', {
            nombrePagina: 'Crear Cuenta en Uptask',
            mensajes: req.flash(),
            email,
            password
        });
    };
};

exports.formularioIniciarSesion = (req, res) => {
    // Extraer errores
    const { error } = res.locals.mensajes;

    // Renderizar
    res.render('iniciarsesion', {
        nombrePagima: 'Iniciar Sesión en Uptask',
        error
    });
};

exports.formularioRestablecerPassword = (req, res) => {
    // Renderizar
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu Contraseña'
    });
}

exports.confirmarCuenta = async (req, res) => {
    // Obtener información del usuario
    const { email } = req.params;
    const usuario = await Usuario.findOne({
        where: {
            email
        }
    });
    if (!usuario) {
        res.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    };

    // Cambiar estado del usuario y guardar en la BD
    usuario.activo = 1;
    await usuario.save();

    // Redireccionar
    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
};
