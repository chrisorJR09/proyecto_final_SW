const pool=require("../db_conection/conection");

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

module.exports={obtenerUsuario, agregarUsuario, validaUsuario, validaCorreo};