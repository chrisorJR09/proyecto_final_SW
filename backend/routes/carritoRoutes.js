/* routes/carritoRoutes.js - ACTUALIZADO */
const express = require('express');
const router = express.Router();

const {
    verCarrito,
    agregarProducto,
    modificarCantidad,
    eliminarProducto,
    vaciarCarrito,
    obtenerResumen,
    finalizarCompra
} = require('../controllers/carritoController');

// Ver carrito completo
router.get('/:usuario_id', verCarrito);

// Agregar producto
router.post('/agregar', agregarProducto);

// Modificar cantidad
router.put('/item/:id', modificarCantidad);

// Eliminar producto
router.delete('/item/:id', eliminarProducto);

// Vaciar carrito
router.delete('/vaciar/:usuario_id', vaciarCarrito);

// Resumen del carrito
router.get('/resumen/:usuario_id', obtenerResumen);

// Finalizar compra (borrar carrito)
router.post('/finalizar', finalizarCompra);

module.exports = router;