const express = require('express');
const { check } = require('express-validator');
//const { validator } = require('sequelize/types/lib/utils/validator-extras');
const router = express.Router();

// importar express validator
const { body } = require('express-validator/check');

//importar el controlador
const proyectosController = require("../controllers/proyectosController");
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const autController = require('../controllers/autController');

module.exports = function () {
    //ruta para el home
    router.get('/', 
        autController.usuarioAutenticado,
        proyectosController.proyectosHome);
    //ruta para nuevos proyectos
    router.get('/nuevo-proyecto', 
        autController.usuarioAutenticado,
        proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);
    //Listar Proyecto
    router.get('/proyectos/:url', 
        autController.usuarioAutenticado,
        proyectosController.proyectoPorUrl);

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id', 
        autController.usuarioAutenticado,
        proyectosController.formularioEditar);
    router.post('/nuevo-proyecto/:id',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    //eliminar proyecto
    router.delete('/proyectos/:url', 
        autController.usuarioAutenticado,
        proyectosController.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', 
        autController.usuarioAutenticado,
        tareasController.agregarTarea);

    //actualizar tarea
    router.patch('/tareas/:id', 
        autController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);
    
    //eliminar tarea
    router.delete('/tareas/:id', 
        autController.usuarioAutenticado,
        tareasController.eliminarTarea);
    
    // crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    
    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', autController.autenticarUsuario);
    
    // cerrar sesiom
    router.get('/cerrar-sesion', autController.cerrarSesion);
    
    //reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerContrasena);
    router.post('/reestablecer', autController.enviarToken);
    router.get('/reestablecer/:token', autController.validarToken);
    router.post('/reestablecer/:token', autController.actualizarContrasena);

    return router;
};
