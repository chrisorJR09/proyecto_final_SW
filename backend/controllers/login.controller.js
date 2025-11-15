
const usuario_DB=require("../models/user.model");
const jwt=require("jsonwebtoken");

const login= async (req,res)=>{
    const {user,password}=req.body; //pendiente agregar el captcha_user

    if(!user || !password){
        return res.status(400).json({error: "Faltan crendenciales"});
    }

    try{
        const correct_user=await usuario_DB.obtenerUsuario(user);

        if(!correct_user){
            return res.status(401).json({"Error": "usuario no encontado"});
        }
        
        if(correct_user.password !== password){
            return res.status(401).json({"Error": "Contraseña incorrecta"});
        }

        const token = jwt.sign(
            {id: correct_user.idUser, role: correct_user.rol},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )
        res.status(200).json({
            message: {"exito": `Bienvenido ${user}`},
            token
        });
        
    }catch(error){
        res.status(500).json("Error al validar la petición");
    }    

}


module.exports={login};