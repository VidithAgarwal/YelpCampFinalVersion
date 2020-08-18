var express    = require("express"),
    router     = express.Router({mergeParams: true}),
	Campground = require("../models/campgrounds"),
	Comment    = require("../models/comments"),
	middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id)
		.then((campground)=> {
			res.render("comments/new", {campground: campground});
		})
		.catch((err) => {
			console,log(err);
		})
})

// Comments Create
router.post("/", middleware.isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id)
		.then((campground)=> {
			Comment.create(req.body.comment)
				.then((comment) => {
					//Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				})
				.catch((err)=> {
					console.log(err);
				})
		})
		.catch((err) => {
			console,log(err);
			res.redirect("/campgrounds")
		})
})

//Comments Edit Form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=> {
	Comment.findById(req.params.comment_id)
		.then((foundComment)=> {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		})
		.catch((err)=> {
			res.redirect("back");
			console.log(err);
		})
})

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=> {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
		.then((comment)=> {
			res.redirect("/campgrounds/" + req.params.id);
		})
		.catch((err) => {
			console.log(err);
			res.redirect("back");
		})
})

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=> {
	Comment.findByIdAndRemove(req.params.comment_id)
		.then(()=> {
			res.redirect("/campgrounds/" + req.params.id)
		})
		.catch((err)=> {
			res.redirect("back");
		})
})

module.exports = router;