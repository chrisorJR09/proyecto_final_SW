
/* controllers/productosController.js */
const ProductosModel = require('../models/productsModel');

// GET /api/productos
const getAllProductos = async (req, res) => {
    try {
        const productos = await ProductosModel.getAllProductos();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};

// GET /api/productos/:id
const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await ProductosModel.getProductoById(id);

        if (!producto)
            return res.status(404).json({ mensaje: "Producto no encontrado" });

        res.json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ mensaje: 'Error al obtener producto' });
    }
};

// POST /api/productos
const crearProducto = async (req, res) => {
    try {
        const data = req.body;
        data.imagen = req.file ? req.file.filename : null;

        const idInsertado = await ProductosModel.insertProducto(data);

        res.json({ mensaje: "Producto creado", id: idInsertado });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ mensaje: "Error al crear producto" });
    }
};

module.exports = {
    getAllProductos,
    getProductoById,
    crearProducto
};


