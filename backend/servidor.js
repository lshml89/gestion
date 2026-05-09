const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./configuracion/conexion");

const app = express();

app.use(cors());
app.use(express.json());

const productoRuta = require("./rutas/productoRuta");
const ventaRuta = require("./rutas/ventaRuta");

app.use("/productos", productoRuta);
app.use("/ventas", ventaRuta);

app.get("/", (req, res) => {
  res.send("Backend de tienda virtual con Yape funcionando");
});

const PUERTO = process.env.PORT || process.env.PUERTO || 3001;

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});