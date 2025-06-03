const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const pool = require("./config/db");

// Importamos las rutas
const usersRoutes = require("./routes/users");  // ✅ Correcto
const productsRoutes = require("./routes/products");
const alertsRoutes = require("./routes/alerts");
const categoriesRoutes = require("./routes/categories");



const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Usar las rutas
console.log("Tipo de usersRoutes:", typeof usersRoutes);
console.log("Contenido de usersRoutes:", usersRoutes);

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("🚀 API funcionando correctamente!");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
