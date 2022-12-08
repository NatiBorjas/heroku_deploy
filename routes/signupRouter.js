const { Router } = require("express");
const signupRouter = Router();
const { registroDaos } = require("../daos/registroDaos.js");
const passport = require("passport");

signupRouter.get("/", registroDaos.get);
signupRouter.get("/errorregistro", registroDaos.errorSignup);
signupRouter.post("/",passport.authenticate("signup", { failureRedirect: "/registro/errorregistro" }),
  registroDaos.postsignup
);

module.exports = signupRouter;
