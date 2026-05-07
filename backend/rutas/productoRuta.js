const express = require("express");
const router = express.Router();

const {
  listarProductos,
} = require("../controladores/productoControlador");

router.get("/", listarProductos);

module.exports = router;