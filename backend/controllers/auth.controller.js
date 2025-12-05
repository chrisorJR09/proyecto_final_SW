
const express= require("express");
const {obtenerUsuario, agregarUsuario, validaUsuario, validaCorreo, guardarTokenReset, verificarTokenReset, actualizaPassword}=require("../models/user.model");
const jwt=require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const nodemailer=require("nodemailer");
const crypto = require("crypto");


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
        console.error("ERROR EN LOGIN:", error);
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

const resetPassword= async (req, res)=>{
    const {correo}=req.body;
    const validacionCorreo= await validaCorreo(correo);
    //validición de correo existente
    if (!validacionCorreo)
        return res.status(400).json({message: "El correo no existe en la DB."});


    try{
        //creación del token
        const token = crypto.randomBytes(32).toString("hex");
        const expiracion=Date.now() + 3600000;//expiración en una hora

        await guardarTokenReset(correo, token, expiracion);

        //const resetLink = `http://localhost:3000/sesion/resetPassword/${token}`;
        const resetLink = `http://localhost:5500/new-password.html?token=${token}`;
        

        const transporter = nodemailer.createTransport({
            service: "gmail",  // o SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Soporte TecnoMex" <${process.env.EMAIL_USER}>',
            to: correo,
            subject: "Restablece tu contraseña",
            html: 
            `
            <p>Has solicitado cambiar tu contraseña. Haz clic en el enlace:</p>
                <a href="${resetLink}" style="color: blue; font-size: 16px;">Restablecer contraseña</a>
                <p>Este enlace expirará en <strong>1 hora</strong>.</p>
            `
        });

        res.json({ message: "Se ha enviado un correo para restablecer la contraseña." });
    }catch(error){
        console.error("Error al enviar correo:", error);
        res.status(500).json({ message: "Ocurrió un error al enviar el correo." });
    }

}


const validarTokenReset= async(req, res)=>{
    const {token} =req.params;

    try{
        const user =await verificarTokenReset(token);
        if(!user){
            return res.status(400).json({
                message: "Token inválido o expirado"
            });
        }

        res.json({
            message: "Token válido.",
            email: user.email
        });

    }catch(error){
        console.error("Error al validar token:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const actualizarPasswordInDB= async (req, res)=>{
    const {token, nvoPassword}=req.body;
    console.log(token, nvoPassword);
    
    try{
        const passwordActualizado=await actualizaPassword(token, nvoPassword);

        if(!passwordActualizado)
            return res.status(404).json({message: "No se encontró la cuenta"});

        return res.status(200).json({message:"Contraseña cambiada con éxito"});

    }catch(error){
        res.status(500).json({message: "Error interno del servidor"});
    }
}



module.exports={login, newUser, genCaptcha, resetPassword, validarTokenReset, actualizarPasswordInDB};