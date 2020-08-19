// Importar librerías
const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const db = require('../config/db');

// Importar modelo de Proyectos
const Proyecto = require('./Proyecto');

// Definir Modelo de Usuario
const Usuario = db.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: {
            msg: 'El usuario ya está registrado'
        },
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'El email no puede ir vacío'
            },
        }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacío'
            }
        }
    },
    token: DataTypes.STRING,
    expiracion: DataTypes.DATE,
    activo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

// Definir Asociaciones
Usuario.hasMany(Proyecto);

// Exportar
module.exports = Usuario;