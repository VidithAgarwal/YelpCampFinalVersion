var Campground = require("../models/campgrounds"),
	Comment    = require("../models/comments");
middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	//is USER Logged isLoggedIn?
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id)
		// Does User own the campground?
		.then((foundCampground)=> {
			if (foundCampground.author.id.equals(req.user._id)) {
				next();
			}
			else {
				res.redirect("back");
			}
		})
		.catch((err)=> {
			console.log(err);
			res.redirect("back");
		})
	}
	else {
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	//is USER Logged isLoggedIn?
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id)
		// Does User own the campground?
		.then((foundComment)=> {
			if (foundComment.author.id.equals(req.user._id)) {
				next();
			}
			else {
				res.redirect("back");
			}
		})
		.catch((err)=> {
			console.log(err);
			res.redirect("back");
		})
	}
	else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj