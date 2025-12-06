const express = require('express');
const router = express.Router();

const { getInventarioGrafica } = require('../controllers/InventarioGraficaController');

router.get('/', getInventarioGrafica);

module.exports = router;
