// controllers/contacto.controller.js

const nodemailer = require("nodemailer");

const EMPRESA_NOMBRE = "TecnoMex";
const EMPRESA_LEMA = '"Todo lo que necesitas, en un solo clic"';

const postContacto = async (req, res) => {
    try {
        const { nombre, correo, mensaje, numero } = req.body;

        if (!nombre || !correo || !mensaje || !numero) {
            return res.status(400).json({ error: "Nombre, correo, mensaje y número son obligatorios" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `Soporte ${EMPRESA_NOMBRE} <${process.env.EMAIL_USER}>`,
            to: correo,
            subject: `${EMPRESA_NOMBRE} — Hemos recibido tu mensaje`,
            html: `
                <div style="font-family: Arial; padding: 15px;">
                    <img src="cid:logoEmpresa" alt="Logo" width="150" style="margin-bottom: 20px;" />

                    <h2><strong>${EMPRESA_NOMBRE}</strong></h2>
                    <h3 style="font-style: italic;">${EMPRESA_LEMA}</h3>

                    <p>Hola ${nombre}, gracias por contactarnos</p>

                    <p style="font-size: 15px;">En breve serás atendido por nuestro equipo.</p>

                    <p><strong> Teléfono registrado:</strong> ${numero}</p>

                    <p>Fecha de recepción: <strong>${new Date().toLocaleString()}</strong></p>
                </div>
            `,
            attachments: [
                {
                    filename: "logo.png",
                    path: "./uploads/logo.png",
                    cid: "logoEmpresa"
                }
            ]
        });

        res.json({ message: "Mensaje enviado correctamente." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al enviar correo de contacto" });
    }
};

module.exports = { postContacto };
