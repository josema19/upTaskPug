// Importar librerías
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

// Referencia al modelo de autenticación
const Usuario = require('../models/Usuario');

// Definir instancia de Passport para el Login
passport.use(
    new LocalStrategy(
        // Default usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                // Obtener usuario
                const usuario = await Usuario.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });

                // Verificar password
                if (!bcrypt.compareSync(password, usuario.password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    });
                };

                // Retornar usuario
                return done(null, usuario);
            } catch (error) {
                return done(null, false, {
                    message: 'Esa cuenta no existe o no está activa'
                });
            }
        }
    )
);

// Serializar usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;