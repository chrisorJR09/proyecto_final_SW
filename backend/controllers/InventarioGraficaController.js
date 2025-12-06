const InventarioModel = require('../models/InventarioGraficaModel');

const getInventarioGrafica = async (req, res) => {
    try {
        const datos = await InventarioModel.getInventario();
        res.json(datos);
    } catch (error) {
        console.error("Error al obtener inventario:", error);
        res.status(500).json({ mensaje: "Error al obtener inventario" });
    }
};

module.exports = {
    getInventarioGrafica
};
