const { Router } = require("express");
const { apiRandomDaos } = require("../daos/randomDaos.js");
const randomsRouter = Router();

randomsRouter.get("/api/randoms", apiRandomDaos.get);
randomsRouter.post("/api/randoms", apiRandomDaos.post);

module.exports =  randomsRouter;