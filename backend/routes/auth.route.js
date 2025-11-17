const express=require("express");
const router=express.Router();

const {login, newUser}= require("../controllers/auth.controller");


//ruta para el login
router.post("/login", login);

//ruta para añadir usuarios
router.post("/newUser", newUser);

module.exports = router;