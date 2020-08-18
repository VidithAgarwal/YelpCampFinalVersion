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
	res.render("register");
})


// SignUp logic Route
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password)
		.then(()=> {
			passport.authenticate("local")(req, res, ()=> {
				res.redirect("/campgrounds");
			})
		})
		.catch((err)=> {
			console.log(err);
			return res.render("register");
		})
})

// Show login form route
router.get("/login", (req, res)=> {
	res.render("login");
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
	res.redirect("/campgrounds");
})

module.exports = router;