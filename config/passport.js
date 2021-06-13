const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Hacer refencia al modelo a authenticar 
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propios (usuario y pass)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                //EL usuario existe pass incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    })
                }

                //El email existe y pass correcto
                return done(null, usuario);

            } catch (error) {
                //El usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//serializar el usuario 
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

//exportar
module.exports = passport;