var mongoose = require("mongoose");

var campground_schema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	createdAt: {type: Date, default: Date.now },
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Campground", campground_schema);