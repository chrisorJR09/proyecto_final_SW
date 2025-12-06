const GraficaModel = require('../models/GraficaModel');

// GET /api/ventas_generales (con o sin filtro)
const getVentasGenerales = async (req, res) => {
    try {
        const { inicio, fin } = req.query;

        // Si no hay fechas → regresar todo
        if (!inicio || !fin) {
            const VentasGenerales = await GraficaModel.getVentasGenerales();
            return res.json(VentasGenerales);
        }

        // Si hay fechas → filtrar
        const VentasFiltradas = await GraficaModel.getVentasGeneralesPorFechas(inicio, fin);
        res.json(VentasFiltradas);

    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ mensaje: 'Error al obtener ventas generales' });
    }
};

module.exports = {
    getVentasGenerales,
    
};