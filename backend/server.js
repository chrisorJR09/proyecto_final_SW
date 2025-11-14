//configuración del servidor
const express = require("express");
const cors = require("cors");

const app=express();

app.use(cors());

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//configuración de arranque del servidor
const PORT = process.env.PORT || 3000;

//Ruta en raíz, para probar el funcionamiento del API
app.get("/", (req, res)=>{
    console.log("Servidor funcionando correctamente");
    res.send("API funcionando correctamente");
})

//Funcion para escuchar al puerto
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})