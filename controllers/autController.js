const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handler/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res , next) => {
    // usuario aut adelante
    if(req.isAuthenticated()) {
        return next();
    }

    //si no aut redirigir a formulario
    return res.redirect('/iniciar-sesion');
}

// Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerra sesion volver al login
    })
}

//genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: { email: req.body.email }});

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    //expiracion
    usuario.expiracion = Date.now();
    usuario.expiracion.setHours(usuario.expiracion.getHours() + 1);

    //guardar en base de datos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Reestablecer contraseña',
        resetUrl,
        archivo: 'reestablecer-contrasena'
    });
        req.flash('correcto', 'Se ha enviado un link de recuperacion de contraseña a tu correo')
        res.redirect('/iniciar-sesion');
    
    
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({where: {
        token: req.params.token
    }});
    //si no encuentra un usuario
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    //formulario para generar contraseña
    res.render('resetContrasena', {
        nombrePagina : 'Reestablecer Contraseña'
    });
}

exports.actualizarContrasena = async (req, res) => {
    //verifica token y fecha de expiracion
    const usuario = await Usuarios.findOne(
        {where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
    }});

    //verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }
    //hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = '';
    usuario.expiracion = null;

    await usuario.save();

    req.flash('correcto', 'Tu Contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}