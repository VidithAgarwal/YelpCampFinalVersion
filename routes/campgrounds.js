var express    = require("express"),
	router     = express.Router({mergeParams: true}),
	Campground = require("../models/campgrounds"),
	middleware = require("../middleware");


//Index - To Show all the campgrounds
router.get("/", (req, res) => {
	Campground.find({})
	.then((Campgrounds) => {
		res.render("campgrounds/Index", {campgrounds: Campgrounds});
	})
	.catch((error) => {
		console.log(error.message);
	})
	
})

// Create - To add a new campground
router.post("/", middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.Description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: description, author: author};
	Campground.create(newCampground)
		.then((campgrounds) => {
			res.redirect("/campgrounds");
		})
		.catch((err) => {
			console.log(err.message);		
	    })
})

// New - Form to get a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/New");
})

// Show - shows more about a campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec()
		.then((foundCampground) => {
			res.render("campgrounds/show", {campground: foundCampground});
		})
	.catch((error) => {
			console.log("ERROR!!!");
		})
})

// Edit - shows the edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership,(req, res)=> {
	Campground.findById(req.params.id)
		.then((foundCampground)=> {				
			res.render("campgrounds/edit", {campground: foundCampground})
		})
})

//Update - Update Logic
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=> {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground)
		.then((updateCampground)=> {
			res.redirect("/campgrounds/" + updateCampground._id);
		})
		.catch((err) => {
			console.log(err);
			res.redirect("back");
		})
})

// Delete - Delete Logic
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=> {
	Campground.findByIdAndRemove(req.params.id)
		.then((campgroundRemoved)=> {
			res.redirect("/campgrounds");
		})
		.catch((err)=> {
			console.log(err);
			res.redirect("back");
		})
})

module.exports = router;