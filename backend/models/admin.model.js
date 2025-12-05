// models/admin.model.js

const pool = require('../db_conection/conexion');

// Obtener todos los productos
async function getProducto() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
}

// Insertar un nuevo producto
async function postProducto(categoria, nombre, precio, descripcion, stock, imagen) {
    const [result] = await pool.query(
        'INSERT INTO productos (categoria, nombre, precio, descripcion, stock, imagen) VALUES (?, ?, ?, ?, ?, ?)',
        [categoria, nombre, precio, descripcion, stock, imagen]
    );
    return result.insertId;
}

// Actualizar un producto existente
async function putProducto(id, categoria, nombre, precio, descripcion, stock, imagen) {
    const [result] = await pool.query(
        'UPDATE productos SET categoria = ?, nombre = ?, precio = ?, descripcion = ?, stock = ?, imagen = ? WHERE id = ?',
        [categoria, nombre, precio, descripcion, stock, imagen, id]
    );
    return result.affectedRows;
}

// Eliminar un producto
async function deleteProducto(id) {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    return result.affectedRows;
}

// Cambiar stock de un producto
async function postCambiarStock(id, nuevoStock) {
    const [result] = await pool.query(
        'UPDATE productos SET stock = ? WHERE id = ?',
        [nuevoStock, id]
    );
    return result.affectedRows;
}


module.exports = {
    getProducto,
    postProducto,
    putProducto,
    deleteProducto,
    postCambiarStock
};