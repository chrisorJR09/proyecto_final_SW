
function validaCamposLogin(req, res, next){
    console.log("BODY RECIBIDO:", req.body);
    const {user,password, captcha}=req.body; //pendiente agregar el captcha_user
    
    if(!user || !password){
        return res.status(400).json({error: "Faltan crendenciales"});
    }

    next();
}

module.exports={validaCamposLogin};