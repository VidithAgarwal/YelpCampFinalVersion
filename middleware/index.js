var Campground = require("../models/campgrounds"),
	Comment    = require("../models/comments");
middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	//is USER Logged isLoggedIn?
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id)
		// Does User own the campground?
		.then((foundCampground)=> {
			if(!foundCampground) {
				req.flash("error", "Campground not found");
				return res.redirect("back");
			}
			if (foundCampground.author.id.equals(req.user._id)) {
				next();
			}
			else {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back");
			}
		})
		.catch((err)=> {
			req.flash("error", "Campground not found")
			res.redirect("back");
		})
	}
	else {
		req.flash("error", "You need to be logged in to do that ")
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
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
		})
		.catch((err)=> {
			req.flash("error", "Comment not found")
			console.log(err);
			res.redirect("back");
		})
	}
	else {
		req.flash("error", "You need to be logged in to do that ")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

module.exports = middlewareObj