const {validaCaptcha}=require("../controllers/auth.controller");


function validaCaptchaLogin(req, res, next){
    const {captcha}=req.body;
    
    if(!captcha){
        return res.status(400).json({ error: "No se envió el captcha" });
    }
    
    const captcha_validado= validaCaptcha(captcha);

    if(!captcha_validado){
        return res.status(401).json({"Error": "captcha invalido"});
    }

    next();
}

module.exports={validaCaptchaLogin};