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
//router.use(authAdmin);

router.get('/', getProducto);
router.post('/',  postProducto);
router.put('/:id',  putProducto);
router.delete('/:id',  deleteProducto);
router.post('/cambiarStock/:id', postCambiarStock);

module.exports = router;
