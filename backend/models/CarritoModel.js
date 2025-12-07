/* models/CarritoModel.js */
const pool = require('../db_conection/conexion');

// Obtener carrito completo del usuario
async function obtenerCarrito(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
        const [items] = await connection.query(`
            SELECT 
                c.id,
                c.usuario_id,
                c.producto_id,
                c.cantidad,
                c.precio_unitario,
                c.fecha_agregado,
                p.nombre,
                p.descripcion,
                p.imagen,
                p.stock,
                p.categoria,
                (c.cantidad * c.precio_unitario) as subtotal_item
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
            ORDER BY c.fecha_agregado DESC
        `, [usuario_id]);

        return items;
    } finally {
        connection.release();
    }
}

// Agregar producto al carrito
async function agregarProducto(usuario_id, producto_id, cantidad) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Verificar si el producto existe y tiene stock
        const [producto] = await connection.query(
            'SELECT id, nombre, precio, stock FROM productos WHERE id = ?',
            [producto_id]
        );

        if (producto.length === 0) {
            throw new Error('Producto no encontrado');
        }

        if (producto[0].stock < cantidad) {
            throw new Error('Stock insuficiente');
        }

        // Verificar si el producto ya está en el carrito
        const [itemExistente] = await connection.query(
            'SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?',
            [usuario_id, producto_id]
        );

        let resultado;

        if (itemExistente.length > 0) {
            // Actualizar cantidad
            const nuevaCantidad = itemExistente[0].cantidad + cantidad;
            
            if (producto[0].stock < nuevaCantidad) {
                throw new Error('Stock insuficiente para esta cantidad');
            }

            await connection.query(
                'UPDATE carrito SET cantidad = ? WHERE id = ?',
                [nuevaCantidad, itemExistente[0].id]
            );

            resultado = {
                id: itemExistente[0].id,
                mensaje: 'Cantidad actualizada',
                producto: producto[0].nombre,
                cantidad_total: nuevaCantidad
            };
        } else {
            // Insertar nuevo producto
            const [insert] = await connection.query(
                'INSERT INTO carrito (usuario_id, producto_id, cantidad, precio_unitario, fecha_agregado) VALUES (?, ?, ?, ?, NOW())',
                [usuario_id, producto_id, cantidad, producto[0].precio]
            );

            resultado = {
                id: insert.insertId,
                mensaje: 'Producto agregado al carrito',
                producto: producto[0].nombre,
                cantidad
            };
        }

        await connection.commit();
        return resultado;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Modificar cantidad de un producto
async function modificarCantidad(id, cantidad) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Obtener info del producto y validar stock
        const [item] = await connection.query(`
            SELECT c.*, p.stock, p.nombre
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.id = ?
        `, [id]);

        if (item.length === 0) {
            throw new Error('Item no encontrado en el carrito');
        }

        if (item[0].stock < cantidad) {
            throw new Error(`Stock insuficiente. Disponible: ${item[0].stock}`);
        }

        // Actualizar cantidad
        await connection.query(
            'UPDATE carrito SET cantidad = ? WHERE id = ?',
            [cantidad, id]
        );

        await connection.commit();

        return {
            mensaje: 'Cantidad actualizada',
            producto: item[0].nombre,
            nueva_cantidad: cantidad,
            nuevo_subtotal: (cantidad * parseFloat(item[0].precio_unitario)).toFixed(2)
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Eliminar producto del carrito
async function eliminarProducto(id) {
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.query(
            'DELETE FROM carrito WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Item no encontrado');
        }

        return {
            mensaje: 'Producto eliminado del carrito',
            id_eliminado: id
        };

    } finally {
        connection.release();
    }
}

// Vaciar carrito completo del usuario
async function vaciarCarrito(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.query(
            'DELETE FROM carrito WHERE usuario_id = ?',
            [usuario_id]
        );

        return {
            mensaje: 'Carrito vaciado',
            items_eliminados: result.affectedRows
        };

    } finally {
        connection.release();
    }
}

// Obtener resumen del carrito
async function obtenerResumen(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
        const [resumen] = await connection.query(`
            SELECT 
                COUNT(*) as total_items,
                SUM(cantidad) as total_productos,
                SUM(cantidad * precio_unitario) as subtotal
            FROM carrito
            WHERE usuario_id = ?
        `, [usuario_id]);

        return {
            usuario_id: parseInt(usuario_id),
            total_items: resumen[0].total_items || 0,
            total_productos: resumen[0].total_productos || 0,
            subtotal: (resumen[0].subtotal || 0).toFixed(2)
        };

    } finally {
        connection.release();
    }
}

// Finalizar compra (vaciar carrito después de venta)
async function finalizarCompra(usuario_id, id_venta) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Obtener items antes de borrar
        const [items] = await connection.query(
            'SELECT COUNT(*) as total FROM carrito WHERE usuario_id = ?',
            [usuario_id]
        );

        // Borrar carrito del usuario
        await connection.query(
            'DELETE FROM carrito WHERE usuario_id = ?',
            [usuario_id]
        );

        await connection.commit();

        return {
            mensaje: 'Compra finalizada, carrito vaciado',
            id_venta,
            items_procesados: items[0].total
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    obtenerCarrito,
    agregarProducto,
    modificarCantidad,
    eliminarProducto,
    vaciarCarrito,
    obtenerResumen,
    finalizarCompra
};