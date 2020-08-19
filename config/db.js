// Importar librerías
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

// Crear configuración de la BD
const sequelize = new Sequelize(
    process.env.BD_NAME,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        host: process.env.BD_HOST,
        dialect: 'mysql',
        port: process.env.BD_PORT,
        define: {
            timestamps: false
        }
    }
);

// Exportar configuración
module.exports = sequelize;