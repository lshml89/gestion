import { useEffect, useState } from "react";
import api from "./servicios/api";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    const respuesta = await api.get("/productos");
    setProductos(respuesta.data);
  };

  const irAPago = () => {
    setMostrarPago(true);
    setMostrarCarrito(false);
    setProductoSeleccionado(null);

    setTimeout(() => {
      const seccionPago = document.getElementById("seccion-pago");
      if (seccionPago) {
        seccionPago.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const agregarCarrito = (producto) => {
    const existe = carrito.find(
      (item) => item.id_producto === producto.id_producto
    );

    if (existe) {
      if (existe.cantidad >= producto.stock) {
        alert("No hay más stock disponible");
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const comprarAhora = (producto) => {
    agregarCarrito(producto);
    irAPago();
  };

  const disminuirCantidad = (id_producto) => {
    setCarrito(
      carrito
        .map((item) =>
          item.id_producto === id_producto
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarProducto = (id_producto) => {
    setCarrito(carrito.filter((item) => item.id_producto !== id_producto));
  };

  const confirmarPago = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      const respuesta = await api.post("/ventas", {
        total: total,
        productos: carrito,
      });

      alert(respuesta.data.mensaje);

      setCarrito([]);
      setMostrarPago(false);
      setMostrarCarrito(false);
      setProductoSeleccionado(null);

      obtenerProductos();
    } catch (error) {
      console.log(error);
      alert("Error al registrar la venta");
    }
  };

  const total = carrito.reduce(
    (suma, item) => suma + Number(item.precio) * item.cantidad,
    0
  );

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor">
      <header className="barra-superior">
        <div className="logo">YapeStore</div>

        <input
          type="text"
          placeholder="Buscar productos..."
          className="buscador"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div
          className="icono-carrito"
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          🛒
          <span className="contador-carrito">{carrito.length}</span>
        </div>
      </header>

      <section className="banner">
        <div>
          <h1>Ofertas especiales con Yape</h1>
          <p>Compra fácil, rápido y seguro desde nuestra tienda virtual</p>
          <button>Ver productos</button>
        </div>
      </section>

      <h2 className="titulo-seccion">Productos disponibles</h2>

      <div className="productos">
        {productosFiltrados.map((producto) => (
          <div className="tarjeta" key={producto.id_producto}>
            <img
              src={`/src/imagenes/${producto.imagen}`}
              alt={producto.nombre}
              onClick={() => setProductoSeleccionado(producto)}
            />

            <span className="etiqueta">Oferta</span>

            <div className="rating">⭐⭐⭐⭐⭐</div>

            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>

            <div className="precio">
              S/ {Number(producto.precio).toFixed(2)}
            </div>

            <span className={producto.stock > 0 ? "stock" : "sin-stock"}>
              Stock: {producto.stock}
            </span>

            <div className="acciones-producto">
              <button
                disabled={producto.stock === 0}
                onClick={() => agregarCarrito(producto)}
              >
                Agregar
              </button>

              <button
                className="btn-comprar"
                disabled={producto.stock === 0}
                onClick={() => comprarAhora(producto)}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarCarrito && (
        <section className="carrito-lateral">
          <div className="carrito-header">
            <h2>🛒 Carrito</h2>

            <button
              className="cerrar-carrito"
              onClick={() => setMostrarCarrito(false)}
            >
              X
            </button>
          </div>

          {carrito.length === 0 ? (
            <p className="vacio">No hay productos.</p>
          ) : (
            <>
              <div className="lista-carrito">
                {carrito.map((item) => (
                  <div className="item-carrito" key={item.id_producto}>
                    <img
                      src={`/src/imagenes/${item.imagen}`}
                      alt={item.nombre}
                    />

                    <div className="info-item">
                      <h4>{item.nombre}</h4>

                      <p>
                        S/ {(Number(item.precio) * item.cantidad).toFixed(2)}
                      </p>

                      <div className="acciones-cantidad">
                        <button
                          onClick={() => disminuirCantidad(item.id_producto)}
                        >
                          -
                        </button>

                        <span>{item.cantidad}</span>

                        <button onClick={() => agregarCarrito(item)}>
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="btn-eliminar-mini"
                      onClick={() => eliminarProducto(item.id_producto)}
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>

              <div className="footer-carrito">
                <h2>Total: S/ {total.toFixed(2)}</h2>

                <button className="btn-pagar" onClick={irAPago}>
                  Continuar compra
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {mostrarPago && (
        <section className="pago-yape" id="seccion-pago">
          <h2>Pago con Yape</h2>

          <p>Escanea el QR y realiza el pago por el monto exacto.</p>

          <img
            src="/src/imagenes/qr-yape.jpg"
            alt="QR Yape"
            className="qr-yape"
          />

          <h3 className="texto-yape">Escanea el QR y paga exactamente:</h3>

          <h1 className="monto-yape">S/ {total.toFixed(2)}</h1>

          <button className="btn-confirmar" onClick={confirmarPago}>
            Confirmar pago
          </button>
        </section>
      )}

      {productoSeleccionado && (
        <div className="fondo-modal">
          <div className="modal-producto">
            <button
              className="cerrar-modal"
              onClick={() => setProductoSeleccionado(null)}
            >
              X
            </button>

            <div className="detalle-imagen">
              <img
                src={`/src/imagenes/${productoSeleccionado.imagen}`}
                alt={productoSeleccionado.nombre}
              />
            </div>

            <div className="detalle-info">
              <span className="etiqueta">Oferta especial</span>

              <h2>{productoSeleccionado.nombre}</h2>

              <div className="rating">⭐⭐⭐⭐⭐</div>

              <p className="descripcion-detalle">
                {productoSeleccionado.descripcion}
              </p>

              <ul className="caracteristicas">
                <li>Producto disponible para entrega inmediata</li>
                <li>Pago rápido mediante Yape</li>
                <li>Stock actualizado automáticamente</li>
                <li>Compra segura desde la tienda virtual</li>
              </ul>

              <h1 className="precio-detalle">
                S/ {Number(productoSeleccionado.precio).toFixed(2)}
              </h1>

              <p className="stock-detalle">
                Stock disponible: {productoSeleccionado.stock}
              </p>

              <div className="acciones-detalle">
                <button onClick={() => agregarCarrito(productoSeleccionado)}>
                  Agregar al carrito
                </button>

                <button
                  className="btn-comprar"
                  onClick={() => comprarAhora(productoSeleccionado)}
                >
                  Comprar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;