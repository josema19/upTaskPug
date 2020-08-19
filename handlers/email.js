// Importar librerías
const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

// Generar HTML
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
};

// Definir Función encargada de enviar correos
exports.enviar = async (opciones) => {
    // Destructuración 
    const { usuario: { email }, subject, archivo } = opciones;

    // Definir Transporte
    let transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
            user: emailConfig.auth.user,
            pass: emailConfig.auth.pass,
        },
    });

    // Obtener html y text
    const html = generarHTML(archivo, opciones);
    const text = htmlToText.fromString(html);

    // Definir Opciones
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com>',
        to: email,
        subject: subject,
        text,
        html
    };

    // Enviar Correo
    let info = await transporter.sendMail(mailOptions);
};