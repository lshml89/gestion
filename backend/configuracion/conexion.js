const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

conexion.connect((error) => {
  if (error) {
    console.log("Error al conectar con MySQL:", error);
  } else {
    console.log("Conectado a MySQL 🚀");
  }
});

module.exports = conexion;