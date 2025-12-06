const express = require('express');
const router = express.Router();

const {
    getProductosPublic,
    getOrdenPrecio,
    getFiltrarPorPrecio,
    getFiltrarCategoria,
    getProductosOferta
} = require("../controllers/tienda.controller.js");


// 
router.get('/public', getProductosPublic);
router.get('/orden/precio', getOrdenPrecio);
router.get('/filtro/precio', getFiltrarPorPrecio);  // ?min=50&max=300
router.get('/filtro/categoria/:categoria', getFiltrarCategoria);
router.get('/filtro/ofertas', getProductosOferta);

module.exports = router;
