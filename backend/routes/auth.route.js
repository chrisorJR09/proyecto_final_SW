const express=require("express");
const router=express.Router();

const {login}= require("../controllers/auth.controller");


//ruta para el login
router.post("/login", login);

module.exports = router;