//routes/bookRoutes.js
const express = require('express');
const router = express.Router();

const {
    getVentasProducto,
    getVentasProductoById,
} = require('../controllers/graficaController');

//  rutas relacionadas con los libros
router.get('/', getVentasProducto);
router.get('/:id', getVentasProductoById);

module.exports = router; // IMPORTANTE