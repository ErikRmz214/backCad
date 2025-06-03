const pool = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM categories ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

module.exports = { getCategories };
