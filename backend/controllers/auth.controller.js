
const express= require("express");
const {obtenerUsuario, agregarUsuario, validaUsuario, validaCorreo, guardarTokenReset, verificarTokenReset, actualizaPassword}=require("../models/user.model");
const jwt=require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const nodemailer=require("nodemailer");
const crypto = require("crypto");
const {intentos, bloqueos}=require("../utils/login.state");
const bcrypt=require("bcrypt");

let CAPTCHA_GENERADO="";
// const intentos={};
// const bloqueos={};


const login= async (req,res)=>{
    const user = req.userLogin
    const password = req.passwordLogin;    

    const ahora = Date.now();

    // if(bloqueos[user] && ahora <bloqueos[user]){
    //     const segundos = Math.ceil((bloqueos[user]-ahora)/1000);
    //     return res.status(403).json({
    //         Error: `Cuenta bloqueada. Intente de nuevo en ${segundos} segundos`
    //     });
    // }
    
    try{
        //console.log("Aqui si llega el codigo")
        const correct_user=await obtenerUsuario(user);
        console.log("USUARIO ENCONTRADO:", correct_user);

        if(!correct_user){
            console.log("usuario no encontrado");
            return res.status(401).json({"Error": "usuario no encontado"});
        }
        
        const passwordValido = await bcrypt.compare(
            password,
            correct_user.password
        );


        if (!passwordValido) {
            intentos[user] = (intentos[user] || 0) + 1;

            console.log("PASSWORD RECIBIDO:", password);
            console.log("PASSWORD REAL:", correct_user.password);
            intentos[user]++;
            console.log("Intentos de acceso: "+ intentos[user]);
            if (intentos[user]>2){
                bloqueos[user]= ahora + (5*60*1000);
                intentos[user]=0;
                return res.status(403).json({Error: "Cuenta bloqueada por 5 minutos"}); 
            }

            console.log(`Contraseña incorrecta. Intentos ${intentos[user]} de 3`);
            return res.status(401).json({Error: `Contraseña incorrecta. Intentos ${intentos[user]} de 3`});
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
            token,
            role: correct_user.rol,
            usuario: correct_user.userName
        });
        console.log(`Bienvenido ${user}`)
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

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const nuevo_usuario= await agregarUsuario(userName, passwordHash, email, nombre, apellido);
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

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

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

        const resetLink = `http://localhost:5500/frontend/html/nuevoPassword.html?token=${token}`;
        //const resetLink = `http://localhost:5501/proyecto_final_SW/frontend/html/nuevoPassword.html?token=${token}`;
        

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

        const hash = await bcrypt.hash(nvoPassword, 10);

        const passwordActualizado=await actualizaPassword(token, hash);

        if(!passwordActualizado)
            return res.status(404).json({message: "No se encontró la cuenta"});

        return res.status(200).json({message:"Contraseña cambiada con éxito"});

    }catch(error){
        res.status(500).json({message: "Error interno del servidor"});
    }
}



module.exports={login, newUser, genCaptcha, resetPassword, validarTokenReset, actualizarPasswordInDB, validaCaptcha};