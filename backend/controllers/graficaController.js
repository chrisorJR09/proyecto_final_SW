/* controllers/graficaController.js */

const GraficaModel = require('../model/GraficaModel');

// GET /api/books
const getVentasProducto = async (req, res) => {
    try {
        const VentasProducto = await GraficaModel.getAllVentasProducto();
        res.json(VentasProducto);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ mensaje: 'Error al obtener libros' });
    }
};

// GET /api/VentasProducto/:id
const getVentasProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const VentasProducto = await GraficaModel.getVentasProductoById(id);

        if (!VentasProducto)
            return res.status(404).json({ mensaje: 'Libro no encontrado' });

        res.json(VentasProducto);
    } catch (error) {
        console.error('Error al obtener libro:', error);
        res.status(500).json({ mensaje: 'Error al obtener libro' });
    }
};


module.exports = {
    getVentasProducto,
    getVentasProductoById,
};
