
const express= require("express");
const {obtenerUsuario, agregarUsuario, validaUsuario, validaCorreo}=require("../models/user.model");
const jwt=require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");

let CAPTCHA_GENERADO="";
const intentos={};
const bloqueos={};


const login= async (req,res)=>{
    console.log("BODY RECIBIDO:", req.body);
    const {user,password, captcha}=req.body; //pendiente agregar el captcha_user
    
    if(!user || !password){
        return res.status(400).json({error: "Faltan crendenciales"});
    }

    if (!intentos[user]) {
        intentos[user] = 0;
    }
    const ahora=Date.now();//obtenemos la hora
    

    if(bloqueos[user] && ahora <bloqueos[user]){
        const segundos = Math.ceil((bloqueos[user]-ahora)/1000);
        return res.status(403).json({
            Error: `Cuenta bloqueada. Intente de nuevo en ${segundos} segundos`
        });
    }
    
    try{
        //console.log("Aqui si llega el codigo")
        const correct_user=await obtenerUsuario(user);
        console.log("USUARIO ENCONTRADO:", correct_user);

        if(!correct_user){
            return res.status(401).json({"Error": "usuario no encontado"});
        }
        
        if(correct_user.password !== password){
            intentos[user]++;
            console.log(intentos[user]);
            if (intentos[user]>2){
                bloqueos[user]= ahora + (5*60*1000);
                intentos[user]=0;
                return res.status(403).json({Error: "Cuenta bloqueada por 5 minutos"}); 
            }
            
            return res.status(401).json({Error: `Contraseña incorrecta. Intentos ${intentos[user]} de 3`});
        }

        const captcha_validado= validaCaptcha(captcha);

        if(!captcha_validado){
            return res.status(401).json({"Error": "captcha invalido"});
        }

         // Si llegó hasta aquí: login exitoso
        intentos[user] = 0;  // Reiniciar intentos
        delete bloqueos[user];

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

const newUser=async (req,res)=>{
    const{userName, password, email, nombre, apellido, captcha}=req.body;

    if(!userName || !password || !email || !nombre || !apellido)
        return res.status(400).json("Error. Campos incompletos");
    
    const captcha_validado= validaCaptcha(captcha);

    if(!captcha_validado){
        return res.status(401).json({"Error": "captcha invalido"});
    }

    try{

        const validacionUsuario= await validaUsuario(userName);
        if(validacionUsuario)
            return res.status(401).json({message: "El usuario ya está registrado."}); 
        const validacionCorreo= await validaCorreo(email);
        if (validacionCorreo)
            return res.status(401).json({message: "El correo ya está registrado."});

        const nuevo_usuario= await agregarUsuario(userName, password, email, nombre, apellido);
        return res.status(201).json({
            mensaje: `Usuario ${userName} agregado.`,
            idUsuario:
             nuevo_usuario
        });
    }catch(error){
        res.status(500).json({message: "Error en el servidor"});
    }
};

const genCaptcha=(req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 3,
    color: true,
    background: '#f2f2f2'
  });

  CAPTCHA_GENERADO = captcha.text;  // Guardamos el texto real
  console.log(CAPTCHA_GENERADO);
  res.type('svg');
  res.status(200).send(captcha.data);
};

/* FUncion que valida el captcha*/
function validaCaptcha(captcha){

  if (!CAPTCHA_GENERADO) {
    return false;
  }

  if (captcha === CAPTCHA_GENERADO) {
    CAPTCHA_GENERADO="";
    return true;
  }

  return false;
};



module.exports={login, newUser, genCaptcha};