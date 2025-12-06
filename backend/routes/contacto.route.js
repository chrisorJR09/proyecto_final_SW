// routes/contacto.route.js

const express = require("express");
const router = express.Router();

const { postContacto } = require("../controllers/contacto.controller");

router.post("/", postContacto);

module.exports = router;
