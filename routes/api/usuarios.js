var express = require('express');
var router = express.Router();
var usuarioController = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioController.usuarios_list);
router.get('/create', usuarioController.usuarios_create);
router.get('/reservar', usuarioController.usuario_reservar);

module.exports = router;