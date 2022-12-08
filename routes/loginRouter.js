const { Router } = require("express");
const loginRouter = Router();
const { loginDaos } = require("../daos/loginDaos.js");
const passport = require("passport");

loginRouter.get("/", loginDaos.get);
loginRouter.get("/errorLogin", loginDaos.errorLogin);
loginRouter.post("/",passport.authenticate("login", { failureRedirect: "/login/errorlogin" }),
  loginDaos.postLogin
);

module.exports = loginRouter;
