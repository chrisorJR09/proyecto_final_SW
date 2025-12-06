// controllers/admin.controller.js

const ProductoModel = require("../models/admin.model.js");

// GET todos los productos
const getProducto = async (req, res) => {
    try {
        const productos = await ProductoModel.getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// POST crear producto
const postProducto = async (req, res) => {
    try {
        const { categoria, nombre, precio, oferta, descripcion, stock, imagen } = req.body;

        const id = await ProductoModel.createProducto({
            categoria,
            nombre,
            precio,
            oferta,
            descripcion,
            stock,
            imagen
        });

        res.json({ message: "Producto creado", id });
    } catch (error) {
        res.status(500).json({ error: "Error al crear producto" });
    }
};

// PUT actualizar producto
const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, nombre, precio, oferta, descripcion, stock, imagen } = req.body;

        const result = await ProductoModel.updateProducto(id, {
            categoria,
            nombre,
            precio,
            oferta,
            descripcion,
            stock,
            imagen
        });

        if (result === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar producto" });
    }
};

// DELETE eliminar producto
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await ProductoModel.deleteProducto(id);

        if (result === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto" });
    }
};

// POST cambiar stock
const postCambiarStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        const result = await ProductoModel.updateStock(id, stock);

        if (result === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Stock actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar stock" });
    }
};

module.exports = {
    getProducto,
    postProducto,
    putProducto,
    deleteProducto,
    postCambiarStock
};
