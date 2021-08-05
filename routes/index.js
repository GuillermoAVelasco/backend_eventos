const express = require('express');
const router = express.Router();

//Controladores
const eventosController = require('../controllers/eventosController');
const detallesEventosController = require('../controllers/detallesEventosController');
const usuariosController = require('../controllers/usuariosController');
const loginController = require('../controllers/loginController');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//Rutas Eventos sin necesidad de Autenticar
router.get('/eventos',eventosController.listarEventos);
router.get('/twitter/:id',eventosController.twitter);
router.get('/eventos/:id',eventosController.ListarEvento);
router.get('/eventosdestacados/',eventosController.listarEventosDestacados);

//Rutas Detalles Eventos
router.get('/detalleseventos',detallesEventosController.listarDetallesEventos);
router.post('/detalleseventos',detallesEventosController.crearDetalleEvento);

//Rutas Usuarios
router.post('/usuario',usuariosController.crearUsuario);

//Rutas Logueo Evento y Detalle con Usuarios Autenticados
router.post('/auth',loginController.tokenUsuario);

//Requiere Token
router.post('/eventodetalles',eventosController.crearEvento);
router.get('/usuario/eventos/:pagina?',eventosController.listarEventosUsuario);

//Rutas desconocidas
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}
  
router.use(unknownEndpoint);

module.exports = router;