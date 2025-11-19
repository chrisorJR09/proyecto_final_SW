const pool = require('../db_conection/conexion');

// ---------------------------------
// Obtener todos los productos
// ---------------------------------
const getAllProductos = async (req, res) => {
    try {
        const [productos] = await pool.query("SELECT * FROM productos");
        res.json(productos);
    } catch (error) {
        console.log("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
};

// ---------------------------------
// Obtener producto por ID
// ---------------------------------
const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.log("Error al obtener producto:", error);
        res.status(500).json({ mensaje: "Error al obtener producto" });
    }
};

// ---------------------------------
// Crear producto con imagen
// ---------------------------------
const crearProducto = async (req, res) => {
    try {
        const { categoria, precio, descripcion, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ mensaje: "Falta la imagen" });
        }

        const imagen = req.file.filename;

        const [resultado] = await pool.query(
            `INSERT INTO productos (categoria, precio, descripcion, stock, imagen)
             VALUES (?, ?, ?, ?, ?)`,
            [categoria, precio, descripcion, stock, imagen]
        );

        res.json({
            mensaje: "Producto creado",
            id: resultado.insertId,
            imagen: `/uploads/${imagen}`
        });

    } catch (error) {
        console.log("Error al crear producto:", error);
        res.status(500).json({ mensaje: "Error al crear producto" });
    }
};

// ---------------------------------
// Actualizar producto
// ---------------------------------
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, precio, descripcion, stock } = req.body;

        let imagen = req.file ? req.file.filename : null;

        const [resultado] = await pool.query(
            `UPDATE productos 
             SET categoria = ?, precio = ?, descripcion = ?, stock = ?, 
                 imagen = COALESCE(?, imagen)
             WHERE id = ?`,
            [categoria, precio, descripcion, stock, imagen, id]
        );

        res.json({
            mensaje: "Producto actualizado",
            cambios: resultado.affectedRows
        });

    } catch (error) {
        console.log("Error al actualizar producto:", error);
        res.status(500).json({ mensaje: "Error al actualizar producto" });
    }
};

// ---------------------------------
// Eliminar producto
// ---------------------------------
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            "DELETE FROM productos WHERE id = ?", [id]
        );

        res.json({
            mensaje: "Producto eliminado",
            eliminados: resultado.affectedRows
        });

    } catch (error) {
        console.log("Error al eliminar producto:", error);
        res.status(500).json({ mensaje: "Error al eliminar producto" });
    }
};

module.exports = {
    getAllProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
