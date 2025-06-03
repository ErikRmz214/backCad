const express = require("express");
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, getProductsByUser } = require("../controllers/productsController");

//Obtención de producto
router.get("/", getProducts);

//Obtención de producto por usuario
router.get("/usuario/:id", getProductsByUser);

//Creación de producto
router.post("/", createProduct);

//Edición de producto
router.put("/:id", updateProduct);

//Eliminación de producto
router.delete("/:id", deleteProduct);

module.exports = router;