/* controllers/ventasController.js */
const VentasModel = require('../models/VentasModel');

// POST /api/ventas/procesar
const procesarVenta = async (req, res) => {
    try {
        const { productos, subtotal, impuesto, envio, total } = req.body;
        
        // Validar que hay productos
        if (!productos || productos.length === 0) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }

        console.log('Productos recibidos:', productos); // Debug

        // ⭐ Calcular el total si no viene del frontend
        let totalCalculado = parseFloat(total) || 0;
        
        if (!totalCalculado || isNaN(totalCalculado)) {
            totalCalculado = 0;
            productos.forEach(item => {
                // Usar precio_unitario que viene del frontend
                const precio = parseFloat(item.precio_unitario) || parseFloat(item.precio) || 0;
                const cantidad = parseInt(item.cantidad) || 1;
                totalCalculado += precio * cantidad;
            });
            
            // Agregar impuesto y envío si vienen
            if (impuesto) totalCalculado += parseFloat(impuesto);
            if (envio) totalCalculado += parseFloat(envio);
        }

        console.log('Total calculado:', totalCalculado); // Debug

        // Validar que el total sea válido
        if (isNaN(totalCalculado) || totalCalculado <= 0) {
            return res.status(400).json({ 
                mensaje: 'Error al calcular el total de la venta',
                debug: { productos, total, totalCalculado }
            });
        }

        // Crear la venta y obtener el ID
        const ventaData = {
            total: totalCalculado,
            fecha: new Date()
        };

        // ⭐ Asegurarse de que cada producto tenga todas las propiedades necesarias
        const productosParaVenta = productos.map(item => ({
            id: item.producto_id || item.id,
            nombre: item.nombre,
            categoria: item.categoria || 'Sin categoría',
            cantidad: parseInt(item.cantidad) || 1,
            precio: parseFloat(item.precio_unitario) || parseFloat(item.precio) || 0,
            precio_unitario: parseFloat(item.precio_unitario) || parseFloat(item.precio) || 0,
            imagen: item.imagen,
            precio_original: parseFloat(item.precio_original) || parseFloat(item.precio) || 0,
            oferta: parseFloat(item.oferta) || 0,
            esta_en_oferta: item.esta_en_oferta || false
        }));

        console.log('Productos procesados:', productosParaVenta); // Debug

        const resultado = await VentasModel.crearVenta(ventaData, productosParaVenta);

        res.json({
            mensaje: 'Venta procesada exitosamente',
            id_venta: resultado.id_venta,
            total: totalCalculado
        });

    } catch (error) {
        console.error('Error al procesar venta:', error);
        res.status(500).json({ 
            mensaje: 'Error al procesar la venta',
            error: error.message 
        });
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