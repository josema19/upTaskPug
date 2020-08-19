// Importar librerías
const { DataTypes } = require('sequelize');
const db = require('../config/db');

// Importar modelo de Proyectos
const Proyecto = require('./Proyecto');

// Definir Modelo de Proyectos
const Tarea = db.define('Tarea', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: DataTypes.STRING(100),
    estado: DataTypes.INTEGER(1),
});

// Definir Asociaciones
Tarea.belongsTo(Proyecto);

// Exportar
module.exports = Tarea;