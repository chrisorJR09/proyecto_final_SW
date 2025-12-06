const pool = require('../db_conection/conexion');

async function crearVenta(ventaData, productos) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        console.log('Creando venta con total:', ventaData.total); // Debug

        // 1. Insertar en ventas_generales
        const [resultVenta] = await connection.query(
            'INSERT INTO ventas_generales (fecha, total) VALUES (?, ?)',
            [ventaData.fecha, ventaData.total]
        );
        const id_venta = resultVenta.insertId;

        console.log('ID de venta creada:', id_venta); // Debug

        // 2. Insertar cada producto en ventas_producto y actualizar stock
        for (const producto of productos) {
            console.log('Procesando producto:', producto); // Debug

            const categoria = producto.categoria || 'Sin categoría';
            const cantidad = parseInt(producto.cantidad) || 1;
            const productoId = producto.id;

            // Verificar que el producto tiene ID válido
            if (!productoId) {
                console.error('Producto sin ID:', producto);
                continue;
            }

            // 2.1 Actualizar conteo por categoría
            const [categoriaExiste] = await connection.query(
                'SELECT cantidad_vendida FROM ventas_producto WHERE categoria = ?',
                [categoria]
            );

            if (categoriaExiste.length > 0) {
                // Si ya existe la categoría, solo actualizamos la cantidad
                await connection.query(
                    'UPDATE ventas_producto SET cantidad_vendida = cantidad_vendida + ? WHERE categoria = ?',
                    [cantidad, categoria]
                );
            } else {
                // Si no existe la categoría, insertamos una nueva fila
                await connection.query(
                    'INSERT INTO ventas_producto (categoria, cantidad_vendida) VALUES (?, ?)',
                    [categoria, cantidad]
                );
            }

            // 2.2 Verificar stock actual
            const [stockActual] = await connection.query(
                'SELECT stock FROM productos WHERE id = ?',
                [productoId]
            );

            if (stockActual.length === 0) {
                throw new Error(`Producto con ID ${productoId} no encontrado`);
            }

            if (stockActual[0].stock < cantidad) {
                throw new Error(`Stock insuficiente para producto ID ${productoId}`);
            }

            // 2.3 Actualizar stock en productos
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [cantidad, productoId]
            );

            console.log(`Stock actualizado para producto ${productoId}`); // Debug
        }

        await connection.commit();
        console.log('Transacción completada exitosamente'); // Debug
        
        return { id_venta };

    } catch (error) {
        await connection.rollback();
        console.error('Error en transacción, rollback ejecutado:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Función auxiliar para obtener venta por ID
async function getVentaById(id) {
    const [ventas] = await pool.query(
        'SELECT * FROM ventas_generales WHERE id = ?',
        [id]
    );
    return ventas[0];
}

module.exports = {
    crearVenta,
    getVentaById
};