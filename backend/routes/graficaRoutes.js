// routes/bookRoutes.js
const express = require('express');
const router = express.Router();

// Importar middleware
const authAdmin = require("../middlewares/admin.middleware.js");

const {
    getVentasProducto,
    getVentasProductoById,
   
} = require('../controllers/graficaController');


 
// Rutas para ventas por producto
router.get('/', authAdmin, getVentasProducto);
router.get('/:id', authAdmin, getVentasProductoById);

module.exports = router;
