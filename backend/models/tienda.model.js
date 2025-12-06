// models/tienda.model.js

const db = require('../db_conection/conexion');

class TiendaModel {

    // Obtener productos para vista pública
    static async getProductosPublic() {
        const [rows] = await db.execute("SELECT * FROM productos");
        return rows;
    }

    // Ordenar por precio ASC
    static async ordenarPorPrecio() {
        const [rows] = await db.execute("SELECT * FROM productos ORDER BY precio ASC");
        return rows;
    }

    // Filtrar por rango de precio
    static async filtrarPorPrecio(min, max) {
        const [rows] = await db.execute(
            "SELECT * FROM productos WHERE precio BETWEEN ? AND ?",
            [min, max]
        );
        return rows;
    }

    // Filtrar por categoría
    static async filtrarCategoria(categoria) {
        const [rows] = await db.execute(
            "SELECT * FROM productos WHERE categoria = ?",
            [categoria]
        );
        return rows;
    }

    // Filtrar por ofertas
    static async productosConOferta() {
        const [rows] = await db.execute(
            "SELECT * FROM productos WHERE oferta IS NOT NULL AND oferta <> ''"
        );
        return rows;
    }

}

module.exports = TiendaModel;
