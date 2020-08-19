var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/users");

// Root Route
router.get("/", (req, res) => {
	res.render("campgrounds/landing");
})


//Register Form Route
router.get("/register", (req, res)=> {
	res.render("register", {page: "register"});
})


// SignUp logic Route
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password)
		.then((user)=> {
			passport.authenticate("local")(req, res, ()=> {
				req.flash("success", "Welcome to YelpCamp" + user.username);
				res.redirect("/campgrounds");
			})
		})
		.catch((err)=> {
			req.flash("error", err.message);
			return res.redirect("/register");
		})
})

// Show login form route
router.get("/login", (req, res)=> {
	res.render("login", {page: "login"});
})

// Login logic route
router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res)=> {	
})

//logout route
router.get("/logout", (req, res)=> {
	req.logout();
	req.flash("success", "LOGGED YOU OUT!!")
	res.redirect("/campgrounds");
})

module.exports = router;