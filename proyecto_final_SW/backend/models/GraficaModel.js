/* model/GraficaModel.js */
const pool = require('../db_conection/conexion');

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

// Obtener ventas generales (sin filtro)
async function getVentasGenerales() {
    const [rows] = await pool.query('SELECT * FROM ventas_generales');
    return rows;   // ✔ regresar todas
}

// Obtener ventas generales por rango de fechas
async function getVentasGeneralesPorFechas(inicio, fin) {
    const [rows] = await pool.query(
        "SELECT * FROM ventas_generales WHERE fecha BETWEEN ? AND ?",
        [inicio, fin]
    );
    return rows;
}


module.exports = {
    getAllVentasProducto,
    getVentasProductoById,
    getVentasGenerales,
    getVentasGeneralesPorFechas
};