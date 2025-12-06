/* controllers/carritoController.js */
const CarritoModel = require('../models/CarritoModel');

// GET /api/carrito/:usuario_id
const verCarrito = async (req, res) => {
    try {
        const { usuario_id } = req.params;

        const items = await CarritoModel.obtenerCarrito(usuario_id);

        // Calcular totales
        const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal_item), 0);
        const total_items = items.length;
        const total_productos = items.reduce((sum, item) => sum + item.cantidad, 0);

        res.json({
            usuario_id: parseInt(usuario_id),
            items,
            resumen: {
                total_items,
                total_productos,
                subtotal: subtotal.toFixed(2)
            }
        });

    } catch (error) {
        console.error('Error al ver carrito:', error);
        res.status(500).json({ mensaje: 'Error al obtener el carrito' });
    }
};

// POST /api/carrito/agregar
const agregarProducto = async (req, res) => {
    try {
        const { usuario_id, producto_id, cantidad = 1 } = req.body;

        // Validaciones básicas
        if (!usuario_id || !producto_id) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }

        if (cantidad < 1) {
            return res.status(400).json({ mensaje: 'La cantidad debe ser al menos 1' });
        }

        const resultado = await CarritoModel.agregarProducto(usuario_id, producto_id, cantidad);

        res.json(resultado);

    } catch (error) {
        console.error('Error al agregar producto:', error);
        
        // Manejar errores específicos
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ mensaje: error.message });
        }
        if (error.message.includes('Stock insuficiente')) {
            return res.status(400).json({ mensaje: error.message });
        }
        
        res.status(500).json({ mensaje: 'Error al agregar producto al carrito' });
    }
};

// PUT /api/carrito/item/:id
const modificarCantidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad < 1) {
            return res.status(400).json({ mensaje: 'La cantidad debe ser al menos 1' });
        }

        const resultado = await CarritoModel.modificarCantidad(id, cantidad);

        res.json(resultado);

    } catch (error) {
        console.error('Error al modificar cantidad:', error);
        
        if (error.message === 'Item no encontrado en el carrito') {
            return res.status(404).json({ mensaje: error.message });
        }
        if (error.message.includes('Stock insuficiente')) {
            return res.status(400).json({ mensaje: error.message });
        }
        
        res.status(500).json({ mensaje: 'Error al modificar cantidad' });
    }
};

// DELETE /api/carrito/item/:id
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await CarritoModel.eliminarProducto(id);

        res.json(resultado);

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        
        if (error.message === 'Item no encontrado') {
            return res.status(404).json({ mensaje: error.message });
        }
        
        res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
};

// DELETE /api/carrito/vaciar/:usuario_id
const vaciarCarrito = async (req, res) => {
    try {
        const { usuario_id } = req.params;

        const resultado = await CarritoModel.vaciarCarrito(usuario_id);

        res.json(resultado);

    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(500).json({ mensaje: 'Error al vaciar carrito' });
    }
};

// GET /api/carrito/resumen/:usuario_id
const obtenerResumen = async (req, res) => {
    try {
        const { usuario_id } = req.params;

        const resumen = await CarritoModel.obtenerResumen(usuario_id);

        res.json(resumen);

    } catch (error) {
        console.error('Error al obtener resumen:', error);
        res.status(500).json({ mensaje: 'Error al obtener resumen' });
    }
};

// POST /api/carrito/finalizar
const finalizarCompra = async (req, res) => {
    try {
        const { usuario_id, id_venta } = req.body;

        if (!usuario_id || !id_venta) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }

        const resultado = await CarritoModel.finalizarCompra(usuario_id, id_venta);

        res.json(resultado);

    } catch (error) {
        console.error('Error al finalizar compra:', error);
        res.status(500).json({ mensaje: 'Error al finalizar compra' });
    }
};

module.exports = {
    verCarrito,
    agregarProducto,
    modificarCantidad,
    eliminarProducto,
    vaciarCarrito,
    obtenerResumen,
    finalizarCompra
};