const { Router } = require("express");
const logoutRouter = Router();

logoutRouter.get("/", (req, res) => {
	if (req.isAuthenticated()) {
    const name = req.session.username;
		req.session.destroy((err) => {
			if (err) {
				return res.json({ status: "Logout ERROR", body: err });
			}
    res.render("pages/logout", { name: name });
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = logoutRouter;