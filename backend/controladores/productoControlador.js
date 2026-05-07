const conexion = require("../configuracion/conexion");

const listarProductos = (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.json(resultados);
  });
};

module.exports = {
  listarProductos,
};