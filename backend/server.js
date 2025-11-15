// server.js 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const graficaRoutes = require('./routes/graficaRoutes');
const pool = require('./db_conection/conexion'); // <-- Importamos la conexión

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Para poder acceder a las imágenes desde el front
app.use('/uploads', express.static('uploads'));

const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);


// Ruta base
app.get('/', (req, res) => {
    res.send('API Ventas de Alexa Yalee Sanchez Tejeda funcionando correctamente');
});

// Rutas principales
app.use('/api/ventas_producto', graficaRoutes);

// Funcion que hace una consulta de prueba mínima que
// confirma que todo el circuito conexión => consulta => respuesta está funcionando
async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result'); // Le pide a MySQL que sume 1 + 1, y le ponga el alias result al valor
        console.log('Conexión a la base de datos establecida. Resultado, Alexa Yalee Sanchez Tejeda:', rows[0].result);
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    }
}


// Iniciar servidor y probar conexión
app.listen(PORT, async () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    await testConnection(); // <------------------- se ejecuta al arrancar el servidor
});
