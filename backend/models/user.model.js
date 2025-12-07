const pool=require("../db_conection/conexion");

async function obtenerUsuario(user) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE userName = ?",
        [user]
    );
    return rows[0];
} 

async function agregarUsuario(userName, password, email, nombre, apellido){
    const [result] = await pool.query(
        "INSERT INTO users (userName, password, rol, email, nombre, apellido) VALUES (?,?,?,?,?,?)",
        [userName, password, 2, email, nombre, apellido]
    )
    return result.userName;
}

async function validaUsuario(user){
    const [result] = await pool.query(
        "SELECT * FROM users WHERE userName = ?",
        [user]
    )
    //retornamos true si el tamaño del arreglo es mayor a 0, si no, se regresará el resultado en false
    return result.length>0;
}

async function validaCorreo(correo){
    const [result] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [correo]
    )
    return result.length>0;
}

async function guardarTokenReset(email, token, expiracion) {
    const [result] = await pool.query(
        "UPDATE users SET resetToken = ?, resetTokenExpiracion = ? WHERE email = ?",
        [token, new Date(expiracion), email]
    );
    return result.affectedRows > 0; // true si se actualizó algún registro
}

async function verificarTokenReset(token){
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiracion > ?",
        [token, Date.now()]
    );

    return rows.length > 0 ? rows[0] : null;
}

async function actualizaPassword(token, password) {
    const [result] = await pool.query(
        "UPDATE users SET password = ? WHERE resetToken = ?",
        [password, token]
    );

    return result.affectedRows>0;
}

module.exports={obtenerUsuario, agregarUsuario, validaUsuario, validaCorreo, guardarTokenReset, verificarTokenReset, actualizaPassword};