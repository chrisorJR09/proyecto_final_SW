/* models/productosModel.js */
const pool = require('../db_conection/conexion');

// Obtener todos los productos
async function getAllProductos() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
}

// Obtener un solo producto por ID
async function getProductoById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
}

// Guardar un nuevo producto
async function insertProducto(producto) {
    const { nombre, descripcion, precio, imagen } = producto;

    const [result] = await pool.query(
        'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio, imagen]
    );

    return result.insertId;
}

module.exports = {
    getAllProductos,
    getProductoById,
    insertProducto,
};
