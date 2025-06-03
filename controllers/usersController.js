const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Obtención de usuarios
const getUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error obteniendo usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

//Creación de usuario
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son necesarios." });
    }
  
    try {
      // Verificar si el correo ya existe
      const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "El correo ya existe." });
      }
  
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email`,
        [name, email, hashedPassword]
      );
  
      res.status(201).json({ message: "✅ Registrado correctamente", usuario: result.rows[0] });
  
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      res.status(500).json({ message: "Error al crear usuario." });
    }
  };
  
//Login usuario

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Correo y contraseña requeridos."});

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) 
            return res.status(401).json({ message: "Credenciales incorrectas"});

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) 
                return res.status(401).json({ message: "Credenciales incorrectas"});

            //Sin devolucion de contraseña
            delete user.password;

            res.json({ message: "🔓 Inicio de sesión exitoso.", usuario: user});
            
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión."});
    }
};

module.exports = { getUsers, registerUser,  loginUser};
