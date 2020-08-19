var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/users"),
	Campground = require("../models/campgrounds");

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
	User.register(new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, avatar: req.body.avatar}), req.body.password)
		.then((user)=> {
			passport.authenticate("local")(req, res, ()=> {
				req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
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

router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err || !foundUser) {
      req.flash("error", "Something went wrong.");
      return res.redirect("back");
    }
    Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("back");
      }
      res.render("show", {user: foundUser, campgrounds: campgrounds});
    })
  });
});

module.exports = router;