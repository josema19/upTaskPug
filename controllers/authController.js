// Importar librerías
const passport = require('passport');
const crypto = require('crypto');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const enviarEmail = require('../handlers/email');

// Importar Modelos
const Usuario = require('../models/Usuario');

// Exportar módulos
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/iniciar-sesion');
    };
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
};

exports.enviarToken = async (req, res) => {
    // Verificar que el usuario exista
    const { email } = req.body;
    const usuario = await Usuario.findOne({
        where: {
            email
        }
    });
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    };

    // Generar un token, expiración y guardar en la BD
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save();

    // Definir url
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    // Envía el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecerpassword'
    });

    // Terminar ejecución
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
    // Validar información del usuario
    const { token } = req.params;
    const usuario = await Usuario.findOne({
        where: {
            token
        }
    });
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    };

    // Renderizar
    res.render('restablecerpassword', {
        nombrePagina: 'Restablecer Contraseña'
    });
};

exports.actualizarPassword = async (req, res) => {
    // Obtener información del usuario
    const { token } = req.params;
    const usuario = await Usuario.findOne({
        where: {
            token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    };

    // Hashear password, eliminar token, expiracion y guardar en la BD
    const { password } = req.body;
    usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null
    await usuario.save();

    // Redireccionar
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
};