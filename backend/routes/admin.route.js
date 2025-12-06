// routes/admin.route.js

const express = require('express');
const router = express.Router();

// Importar middleware
const authAdmin = require("../middlewares/admin.middleware.js");

const {
    getProducto,
    postProducto,
    putProducto,
    deleteProducto,
    postCambiarStock
} = require("../controllers/admin.controller.js");

// PROTEGER TODAS LAS RUTAS DE ADMIN
router.use(authAdmin);

router.get('/', authAdmin, getProducto);
router.post('/', authAdmin, postProducto);
router.put('/:id', authAdmin, putProducto);
router.delete('/:id', authAdmin, deleteProducto);
router.post('/cambiarStock/:id', authAdmin, postCambiarStock);

module.exports = router;
