const conexion = require("../configuracion/conexion");

const registrarVenta = (req, res) => {
  const { total, productos } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ mensaje: "El carrito está vacío" });
  }

  const sqlVenta = "INSERT INTO ventas (total, estado_pago) VALUES (?, 'pagado')";

  conexion.query(sqlVenta, [total], (error, resultadoVenta) => {
    if (error) {
      return res.status(500).json(error);
    }

    const id_venta = resultadoVenta.insertId;

    productos.forEach((producto) => {
      const sqlDetalle = `
        INSERT INTO detalle_ventas
        (id_venta, id_producto, cantidad, precio)
        VALUES (?, ?, ?, ?)
      `;

      conexion.query(sqlDetalle, [
        id_venta,
        producto.id_producto,
        producto.cantidad,
        producto.precio,
      ]);

      const sqlStock = `
        UPDATE productos
        SET stock = stock - ?
        WHERE id_producto = ? AND stock >= ?
      `;

      conexion.query(sqlStock, [
        producto.cantidad,
        producto.id_producto,
        producto.cantidad,
      ]);
    });

    res.json({
      mensaje: "Pago confirmado, venta registrada y stock actualizado",
      id_venta: id_venta,
      estado_pago: "pagado",
    });
  });
};

module.exports = {
  registrarVenta,
};