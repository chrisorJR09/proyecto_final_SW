// middlewares/authAdmin.middleware.js
const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica que el usuario sea administrador
        if (decoded.rol !== "admin") {
            return res.status(403).json({ error: "Acceso denegado: Solo administradores" });
        }

        // Guardar datos del usuario en la request
        req.user = decoded;

        next(); // Continúa con la ruta
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = authAdmin;