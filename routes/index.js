const homeRouter = require("./homeRouter.js");
const loginRouter = require("./loginRouter.js");
const logoutRouter = require("./logoutRouter.js");
const signupRouter = require("./signupRouter.js");
const productosRouter = require("./productosRouter.js");
const infoRouter = require("./infoRouter.js");
const randomsRouter = require("./randomRouter.js");

module.exports = { 
	homeRouter, 
	productosRouter, 
	loginRouter, 
	logoutRouter,
	signupRouter,
	infoRouter,
	randomsRouter
};
