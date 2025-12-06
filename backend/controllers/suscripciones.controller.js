// controllers/suscripciones.controller.js

const SuscripcionesModel = require("../models/suscripciones.model");
const nodemailer = require("nodemailer");
const EMPRESA_NOMBRE = "TecnoMex";

const postSuscripcion = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ error: "El correo es obligatorio" });
        }

        const existe = await SuscripcionesModel.existeCorreo(correo);
        if (existe) {
            return res.status(400).json({ error: "Este correo ya está suscrito" });
        }

        await SuscripcionesModel.crearSuscripcion(correo);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

<<<<<<< HEAD
=======
        const logoURL = "https://i.imgur.com/9v3hZ5B.png";
>>>>>>> 92ded4432f76c880c5f7838bf9a9112c6b447528

        await transporter.sendMail({
            from: `Soporte "${EMPRESA_NOMBRE}" <${process.env.EMAIL_USER}>`,
            to: correo,
            subject: "¡Gracias por suscribirte!",
            html: `
                <div style="font-family: Arial; padding: 15px;">
                    <img src="cid:logoEmpresa" alt="Logo" width="150" style="margin-bottom: 20px;" />

                    <h2>¡Bienvenido(a) a ${EMPRESA_NOMBRE}!</h2>
                    <p style="font-weight: bold; font-size: 14px;"> "Todo lo que necesitas, en un solo clic" </p>

                    <p>Gracias por suscribirte a nuestra página, ahora eres un TecnoAmigo </p>

                    <p>
                        Tu cupón aplicará un 10% de descuento en el total de tu primera compra.
                        <br><br>
                        <strong style="font-size: 22px;">PRIMERA-COMPRA</strong>
                    </p>

                    <p>Este cupón solo puede usarse una vez.</p>
                </div>
            `,

            attachments: [
                {
                    filename: "logo.png",
                    path: "./uploads/logo.png", // tu archivo REAL
                    cid: "logoEmpresa" // este es el ID que se usa en el HTML
                }
    ]
        });

        res.json({ message: "Suscripción exitosa. Correo enviado." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al suscribir correo" });
    }
};


const usarCupon = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ error: "Correo obligatorio" });
        }

        const usuario = await SuscripcionesModel.existeCorreo(correo);
        if (!usuario) {
            return res.status(404).json({ error: "Correo no encontrado" });
        }

        if (usuario.cupon === 0) {
            return res.status(400).json({ error: "El cupón ya fue usado" });
        }

        await SuscripcionesModel.desactivarCupon(correo);

        res.json({ message: "Cupón marcado como usado" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar cupón" });
    }
};

module.exports = {
    postSuscripcion,
    usarCupon
};