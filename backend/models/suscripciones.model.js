// models/suscripciones.model.js
const db = require("../db_conection/conexion");

class SuscripcionesModel {

    static async crearSuscripcion(correo) {
        const [result] = await db.execute(
            "INSERT INTO suscripciones (correo, cupon) VALUES (?, true)",
            [correo]
        );
        return result.insertId;
    }

    static async existeCorreo(correo) {
        const [rows] = await db.execute(
            "SELECT * FROM suscripciones WHERE correo = ?",
            [correo]
        );
        return rows[0];
    }

    static async desactivarCupon(correo) {
        const [result] = await db.execute(
            "UPDATE suscripciones SET cupon = false WHERE correo = ?",
            [correo]
        );
        return result.affectedRows;
    }
}

module.exports = SuscripcionesModel;
