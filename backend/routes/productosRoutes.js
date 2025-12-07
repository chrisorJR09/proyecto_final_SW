const express = require('express');
const router = express.Router();
const upload = require('../multer.config'); 

const {
    getAllProductos,
    getProductoById,
} = require('../controllers/productosController');


//const authUser=require("../middlewares/validaUsuario");

// Obtener todos los productos
router.get('/',getAllProductos);

// Obtener un producto por ID
router.get('/:id', getProductoById);

// Crear producto con imagen
//router.post('/', upload.single('imagen'), crearProducto);

// Actualizar producto con imagen opcional
//router.put('/:id', upload.single('imagen'), actualizarProducto);

// Eliminar producto
//router.delete('/:id', eliminarProducto);

module.exports = router;
