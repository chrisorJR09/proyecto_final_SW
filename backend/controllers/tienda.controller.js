// controllers/tienda.controller.js

const TiendaModel = require('../models/tienda.model');

// Productos para usuarios
const getProductosPublic = async (req, res) => {
    try {
        const data = await TiendaModel.getProductosPublic();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// Ordenar de menor a mayor precio
const getOrdenPrecio = async (req, res) => {
    try {
        const data = await TiendaModel.ordenarPorPrecio();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al ordenar productos" });
    }
};

// Filtrar por rango de precios
const getFiltrarPorPrecio = async (req, res) => {
    try {
        const { min, max } = req.query;
        const data = await TiendaModel.filtrarPorPrecio(min, max);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al filtrar por precio" });
    }
};

// Filtrar por categoría
const getFiltrarCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const data = await TiendaModel.filtrarCategoria(categoria);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al filtrar categoría" });
    }
};

// Productos con oferta
const getProductosOferta = async (req, res) => {
    try {
        const data = await TiendaModel.productosConOferta();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener ofertas" });
    }
};

module.exports = {
    getProductosPublic,
    getOrdenPrecio,
    getFiltrarPorPrecio,
    getFiltrarCategoria,
    getProductosOferta
};
