    const express=require("express");
    const router=express.Router();

    const {login, newUser, genCaptcha, resetPassword, validarTokenReset, actualizarPasswordInDB}= require("../controllers/auth.controller");
    const {validaCamposLogin}=require("../middlewares/validaCamposLogin");
    const {validaCaptchaLogin}=require("../middlewares/validaCaptchaLogin");
    const {tiempoBloqueoLogin} = require("../middlewares/tiempoBloqueoLogin");
    const {limiteIntentoslogin} = require("../middlewares/limiteIntentosLogin");


    //ruta para el login
    router.post("/login", validaCamposLogin, validaCaptchaLogin, tiempoBloqueoLogin, limiteIntentoslogin, login);

    //ruta para añadir usuarios
    router.post("/newUser", newUser);

    router.get('/captcha', genCaptcha);
    router.post("/resetPassword", resetPassword);
    router.get("/resetPassword/:token", validarTokenReset);
    router.post("/setNewPassword", actualizarPasswordInDB);

    module.exports = router;