const express=require("express");
const router=express.Router();

const {login, newUser, genCaptcha, resetPassword, validarTokenReset, actualizarPasswordInDB}= require("../controllers/auth.controller");


//ruta para el login
router.post("/login", login);

//ruta para añadir usuarios
router.post("/newUser", newUser);
router.get('/captcha', genCaptcha);
router.post("/resetPassword", resetPassword);
router.get("/resetPassword/:token", validarTokenReset);
router.post("/setNewPassword", actualizarPasswordInDB);

module.exports = router;