// server.js 
// Rutas principales


//configuración del servidor
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require('./db_conection/conexion'); // <-- Importamos la conexión



const app=express();

app.use(cors());



//configuración de arranque del servidor
const PORT = process.env.PORT || 3000;
//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());




//Ruta en raíz, para probar el funcionamiento del API
app.get("/", (req, res)=>{
    console.log("Servidor funcionando correctamente");
    res.send("API funcionando correctamente");
})

const rutaLogin=require("./routes/auth.route");
app.use("/sesion/", rutaLogin);

const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);

const graficaRoutes = require('./routes/graficaRoutes');
app.use('/api/ventas_producto', graficaRoutes);

const VentasGeneralesRoutes = require('./routes/VentasGeneralesRoutes');
app.use('/api/ventas_generales', VentasGeneralesRoutes);   

const InventarioGraficaRoutes = require('./routes/InventarioGraficaRoutes');
app.use('/api/inventario_grafica', InventarioGraficaRoutes);


// Para poder acceder a las imágenes desde el front
app.use('/uploads', express.static('uploads'));

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result'); // Le pide a MySQL que sume 1 + 1, y le ponga el alias result al valor
        console.log('Conexión a la base de datos establecida. Resultado, Alexa Yalee Sanchez Tejeda:', rows[0].result);
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    }
}


//Funcion para escuchar al puerto
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})
