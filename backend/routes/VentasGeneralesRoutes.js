const express = require('express');
const router = express.Router();

const { getVentasGenerales } = require('../controllers/VentasGeneralesController');


router.get('/', getVentasGenerales);

module.exports = router;