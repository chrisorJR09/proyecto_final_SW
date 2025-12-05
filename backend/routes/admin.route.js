// routes/admin.route.js

const express = require('express');
const router = express.Router();

const {
    getProducto,
    postProducto,
    putProducto,
    deleteProducto,
    postCambiarStock
}= require("../controllers/admin.controller.js");

router.get ('/', getProducto);
router.post ('/', postProducto);
router.put ('/:id', putProducto);
router.delete ('/:id', deleteProducto);
router.post ('/cambiarStock/:id', postCambiarStock);

module.exports = router;