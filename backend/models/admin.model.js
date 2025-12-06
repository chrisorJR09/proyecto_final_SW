// models/admin.model.js

const db = require("../db_conection/conexion.js");

class ProductoModel {
    static async getProductos() {
        const [rows] = await db.execute("SELECT * FROM productos");
        return rows;
    }

    static async getProductoById(id) {
        const [rows] = await db.execute("SELECT * FROM productos WHERE id = ?", [id]);
        return rows[0];
    }

    static async createProducto({ categoria, nombre, precio, oferta, descripcion, stock, imagen }) {
        const [result] = await db.execute(
            `INSERT INTO productos (categoria, nombre, precio, oferta, descripcion, stock, imagen) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [categoria, nombre, precio, oferta, descripcion, stock, imagen]
        );
        return result.insertId;
    }

    static async updateProducto(id, { categoria, nombre, precio, oferta, descripcion, stock, imagen }) {
        const [result] = await db.execute(
            `UPDATE productos 
             SET categoria=?, nombre=?, precio=?, oferta=?, descripcion=?, stock=?, imagen=? 
             WHERE id=?`,
            [categoria, nombre, precio, oferta, descripcion, stock, imagen, id]
        );
        return result.affectedRows;
    }

    static async deleteProducto(id) {
        const [result] = await db.execute(
            "DELETE FROM productos WHERE id=?",
            [id]
        );
        return result.affectedRows;
    }

    static async updateStock(id, nuevoStock) {
        const [result] = await db.execute(
            "UPDATE productos SET stock=? WHERE id=?",
            [nuevoStock, id]
        );
        return result.affectedRows;
    }
}

module.exports = ProductoModel;