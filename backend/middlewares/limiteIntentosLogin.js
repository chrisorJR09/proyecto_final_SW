const {intentos}=require("../utils/login.state");


function limiteIntentoslogin(req, res, next){
    const {user, password}=req.body;

    if (!intentos[user]) {
        intentos[user] = 0;
    }

    req.userLogin = user;
    req.passwordLogin = password;

    next();
}

module.exports={limiteIntentoslogin};