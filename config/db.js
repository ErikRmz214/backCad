const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "caducadosdb",
    password: "R@psodia2133",
    port: 5432,
});

pool.connect()
    .then(() => console.log("✅ Base de datos conectada"))
    .catch(err => console.error("❌ Error de conexión a la BD:", err));

module.exports = pool;
