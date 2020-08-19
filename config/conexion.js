// Importar librerías
const db = require('./db');

// Importar Modelos
require('../models/Proyecto');
require('../models/Tarea');
require('../models/Usuario');

const conexionDB = async () => {
    // Definir tablas en función de los modelos
    try {
        await db.sync();
        console.log('Base de Datos Conectada');
    } catch (error) {
        console.log(error);
        process.exit(1);
    };
};

module.exports = conexionDB;