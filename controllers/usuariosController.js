const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handler/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    const { email, password} = req.body;

    try { 
        //crea usuario
        await Usuarios.create({
        email,
        password
    });

    //crea una url de confirm
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    //crear objeto usuario
    const usuario = {
        email
    }
    //enviar email
    await enviarEmail.enviar({
        usuario,
        subject: 'Confirma tu cuenta UpTask',
        confirmarUrl,
        archivo: 'confirmar-cuenta'
    });

    //redirigir al usuario

    req.flash('correcto', 'Correo de confirmacion enviado, revisa tu bandeja de entrada')
    res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta',
        {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });
    }

    
    
}

exports.formReestablecerContrasena = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer contraseña'
    });
}

//cambia estado de cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada'),
    res.redirect('/iniciar-sesion');
}