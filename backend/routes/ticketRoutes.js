const express = require("express");
const router = express.Router();
const { generarTicket } = require("../controllers/ticketController");

router.post("/generar", generarTicket);

module.exports = router;
