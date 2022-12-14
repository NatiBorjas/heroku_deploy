const { Router } = require("express");
const homeRouter = Router();

homeRouter.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("pages/home", {
      name: req.session.username,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = homeRouter;
