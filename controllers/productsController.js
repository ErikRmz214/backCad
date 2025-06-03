 const pool = require("../config/db");

 //obtener todos los productos

 const getProducts = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, category_id FROM products");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error obteniendo productos:", error);
        res.status(500).json({ message: "Error al obtener productos"});
    }
 };

 //obtener productos por usuario

 const getProductsByUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query(
        `SELECT 
           p.id, 
           p.name, 
           p.expiration_date, 
           p.quantity,
           c.name AS category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.user_id = $1
         ORDER BY p.expiration_date ASC`,
        [userId]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error("❌ Error obteniendo productos por usuario:", error);
      res.status(500).json({ message: "Error al obtener productos del usuario" });
    }
  };
  
  

 //crear nuevo producto "formulario"

 const createProduct = async (req, res) => {
    const {name, category_id, expiration_date, quantity, user_id } = req.body;

    if (!name || !category_id || !expiration_date || !quantity || !user_id) {
        return res.status(400).json({ message: "Todos los campos son requeridos."});
    }

    try {
        const insertProduct = await pool.query(
            `INSERT INTO products (name, category_id, expiration_date, quantity, user_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, category_id, expiration_date, quantity, user_id]
        );

        const product = insertProduct.rows[0];

        //verificacion de alerta

        const today = new Date();
        const caducidad = new Date(expiration_date);
        const diffDays = Math.ceil((caducidad - today) / (1000 * 60 * 60 * 24));

        let alert_type = null;
        if (diffDays <= 0) alert_type = "Caducado";
        else if (diffDays <= 7) alert_type = "Próximo a caducar";

        if (alert_type) {
            await pool.query(
                `INSERT INTO alerts (product_id, user_id, alert_type)
                VALUES ($1, $2, $3)`,
                [product.id, user_id, alert_type]
            );
        }
        
        res.status(201).json({ message: "✅ Producto registrado correctamente", producto: product});

    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        res.status(500).json({ message: "Error al registrar producto."});
    }
 };

 //Editar producto

 const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category_id, expiration_date, quantity } = req.body;

    if (!name || !category_id || !expiration_date || !quantity) {
        return res.status(400).json({ message: "Todos los campos son requeridos."});
    }

    try {
        const result = await pool.query(
            `UPDATE products
            set name = $1, category_id = $2, expiration_date = $3, quantity = $4
            WHERE id = $5 RETURNING *`,
            [name, category_id, expiration_date, quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado."});
        }

        res.json({ message: "✅ Producto actualizado", producto: result.rows[0] });
    } catch (error) {
        console.error("❌ Error al actualizar el producto: ", error);
        res.status(500).json({ message: "Error al actualizar producto." });
    }
 };

 //Eliminar producto

 const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        //Eliminar alertas relacionadas
        await pool.query("DELETE FROM alerts WHERE product_id = $1", [id]);

        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado."});
        }

        res.json({ message: "Producto eliminado correctamente" });
        
    } catch (error) {
        console.error("❌ Error al eliminar producto: ", error);
        res.status(500).json({ message: "Error al eliminar el producto." });
    }
 };

 module.exports = { getProducts, getProductsByUser, createProduct, updateProduct, deleteProduct };