/* model/GraficaModel.js */
const pool = require('../db/conexion');

// Obtener todos las Ventas
async function getAllVentasProducto() {
    const [rows] = await pool.query('SELECT * FROM ventas_producto');
    return rows;
}

// Obtener un ventas por ID
async function getVentasProductoById(id) {
    const [rows] = await pool.query('SELECT * FROM ventas_producto WHERE id = ?', [id]);
    return rows[0];
}


module.exports = {
    getAllVentasProducto,
    getVentasProductoById,
};
