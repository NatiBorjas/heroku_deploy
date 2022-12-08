const { Router } = require("express");
const { productosDaos } = require("../daos/productosDaos.js");

const productosRouter = Router();
productosRouter.get("/", productosDaos.getData);

module.exports = productosRouter;
