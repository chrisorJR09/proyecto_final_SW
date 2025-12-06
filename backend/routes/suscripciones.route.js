// routes/suscripciones.route.js

const express = require("express");
const router = express.Router();

const { postSuscripcion, usarCupon } = require("../controllers/suscripciones.controller");

router.post("/", postSuscripcion);
router.post("/usar-cupon", usarCupon);

module.exports = router;
