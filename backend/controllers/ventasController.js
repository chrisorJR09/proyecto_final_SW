/* controllers/ventasController.js */
const VentasModel = require('../models/VentasModel');

// POST /api/ventas/procesar
const procesarVenta = async (req, res) => {
    try {
        const { productos } = req.body; // Array de productos del carrito
        
        // Validar que hay productos
        if (!productos || productos.length === 0) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }

        // Calcular el total
        let total = 0;
        productos.forEach(item => {
            total += item.precio * item.cantidad;
        });

        // Crear la venta y obtener el ID
        const ventaData = {
            total: total,
            fecha: new Date()
        };

        const resultado = await VentasModel.crearVenta(ventaData, productos);

        res.json({
            mensaje: 'Venta procesada exitosamente',
            id_venta: resultado.id_venta,
            total: total,
            ticket: resultado.ticket
        });

    } catch (error) {
        console.error('Error al procesar venta:', error);
        res.status(500).json({ mensaje: 'Error al procesar la venta' });
    }
};

// GET /api/ventas/:id
const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await VentasModel.getVentaById(id);

        if (!venta) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        res.json(venta);
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ mensaje: 'Error al obtener venta' });
    }
};

module.exports = {
    procesarVenta,
    getVentaById
};