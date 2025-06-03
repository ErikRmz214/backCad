const express = require("express");
const router = express.Router();
const { getAlerts } = require("../controllers/alertsController");

//ruta para obtener las alertas

router.get("/", getAlerts);

module.exports = router;