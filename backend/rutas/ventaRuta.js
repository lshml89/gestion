const express = require("express");
const router = express.Router();

const { registrarVenta } = require("../controladores/ventaControlador");

router.post("/", registrarVenta);

module.exports = router;