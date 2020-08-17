var Campground             = require("./models/campgrounds"),
	methodOverride         = require("method-override")
	bodyParser	           = require("body-parser"),
	mongoose 		       = require("mongoose"),
	passport               = require("passport"),
	LocalStratergy         = require("passport-local"),
	Comment                = require("./models/comments"),
	express 	           = require("express"),
	seedDB                 = require("./seeds"),
	User                   = require("./models/users"),
	app                    = express();

//Requiring Routes
var commentRoutes          = require("./routes/comments"),
	campgroundRoutes       = require("./routes/campgrounds"),
	authRoutes             = require("./routes/authentication")

// seedDB(); //seed the database	
mongoose.connect("mongodb+srv://VidithAgarwal:<password>@cluster0.zxf3z.mongodb.net/<dbname>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => {
		console.log("Database has been connected");
	})
	.catch((error) => {
		console.log(error.message);
	})

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Passport Configuration
app.use(require("express-session")({
	secret: "MS Dhoni is GOD!!",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);

var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("YelpCamp Server has started!");
})