const pool=require("../db_conection/conection");

async function obtenerUsuario(user) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE userName = ?",
        [user]
    );
    return rows[0];
} 

module.exports={obtenerUsuario};