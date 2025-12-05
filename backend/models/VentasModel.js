const pool = require('../db_conection/conexion');

async function crearVenta(ventaData, productos) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertar en ventas_generales
        const [resultVenta] = await connection.query(
            'INSERT INTO ventas_generales (fecha, total) VALUES (?, ?)',
            [ventaData.fecha, ventaData.total]
        );
        const id_venta = resultVenta.insertId;

        // 2. Insertar cada producto en ventas_producto y actualizar stock
        for (const producto of productos) {
            // ventas_producto
// 2. Actualizar conteo por categoría
            const [categoriaExiste] = await connection.query(
                'SELECT cantidad_vendida FROM ventas_producto WHERE categoria = ?',
                [producto.categoria]
            );

            if (categoriaExiste.length > 0) {
                // Si ya existe la categoría, solo actualizamos la cantidad
                await connection.query(
                    'UPDATE ventas_producto SET cantidad_vendida = cantidad_vendida + ? WHERE categoria = ?',
                    [producto.cantidad, producto.categoria]
                );
            } else {
                // Si no existe la categoría, insertamos una nueva fila
                await connection.query(
                    'INSERT INTO ventas_producto (categoria, cantidad_vendida) VALUES (?, ?)',
                    [producto.categoria, producto.cantidad]
                );
            }


            // actualizar stock en productos
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [producto.cantidad, producto.id]
            );
        }

        await connection.commit();
        return { id_venta };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    crearVenta
};
