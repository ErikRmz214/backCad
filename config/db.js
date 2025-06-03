const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Necesario para conectar con Render
  },
});

pool.connect()
  .then(() => console.log("✅ Base de datos conectada"))
  .catch(err => console.error("❌ Error de conexión a la BD:", err));

module.exports = pool;
