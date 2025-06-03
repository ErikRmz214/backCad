const pool = require("../config/db");

//obtener todas las alertas

const getAlerts = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, product_id FROM alerts");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error obteniendo alertas:", error);
        res.status(500).json({ message: "Error al obtener las alertas"});
    }
};

module.exports = { getAlerts };