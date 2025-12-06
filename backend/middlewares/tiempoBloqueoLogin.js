const bloqueos=require("../utils/login.state");


function tiempoBloqueoLogin(req, res, next){
    const {user}=req.body;

    const ahora=Date.now();//obtenemos la hora

    if(!bloqueos[user])
        return next();

    if (ahora >= bloqueos[user]) {
        delete bloqueos[user];
        return next();
    }

    // Si el bloqueo sigue activo bloqueamos acceso
    const segundosRestantes = Math.ceil((bloqueos[user] - ahora) / 1000);

    return res.status(403).json({
        Error: `Cuenta bloqueada. Intente de nuevo en ${segundosRestantes} segundos`
    });

}

module.exports={tiempoBloqueoLogin};