const pool = require('../db_conection/conexion');

// Obtener nombre del producto + cantidad (stock)
async function getInventario() {
    const [rows] = await pool.query(`
        SELECT nombre AS producto, stock AS cantidad
        FROM productos
    `);
    return rows;
}

module.exports = {
    getInventario
};
