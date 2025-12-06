// routes/bookRoutes.js
const express = require('express');
const router = express.Router();

const {
    getVentasProducto,
    getVentasProductoById,
   
} = require('../controllers/graficaController');


 
// Rutas para ventas por producto
router.get('/', getVentasProducto);
router.get('/:id', getVentasProductoById);

module.exports = router;
