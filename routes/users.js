const express = require("express");
const router = express.Router();
const { getUsers, registerUser, loginUser } = require("../controllers/usersController");

// Obtención de usuarios
router.get("/", getUsers);

//Creación de usuario
router.post("/register", registerUser);

// Inicio de sesión
router.post("/login", loginUser);


module.exports = router; 
