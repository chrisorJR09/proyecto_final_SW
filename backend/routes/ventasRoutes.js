/* routes/ventasRoutes.js */
const express = require('express');
const router = express.Router();

const {
    procesarVenta,
    getVentaById
} = require('../controllers/ventasController');

// Procesar una nueva venta
router.post('/procesar', procesarVenta);

// Obtener detalles de una venta
router.get('/:id', getVentaById);

module.exports = router;