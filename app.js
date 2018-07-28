var express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    parser   = require('body-parser'),
    override = require('method-override'),
    passport = require('passport'),
    local    = require('passport-local'),
    flash    = require('connect-flash'),
// ========
// MODEL REQUIREMENTS
// ========
    User     = require('./models/user'),
    Park     = require('./models/park'),
    Landmark = require('./models/landmark'),
    Comment  = require('./models/comment'),
    Submission  = require('./models/submission');


var parkRoutes      = require("./routes/parks"),
    landmarkRoutes  = require("./routes/landmarks"),
    indexRoutes     = require("./routes/index"),
    commentRoutes   = require("./routes/comments");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

var databaseUri = process.env.DATABASEURL || "mongodb://localhost/ParksAndMarks";
mongoose.connect(databaseUri, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use(parser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(override("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "You have access to the website!",
    // the two following are mandatory.
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use( pass in the local strategy that required )
// User.authenticate() is not one that we wrote, included in package
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/parks", parkRoutes);
app.use("/landmarks", landmarkRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Parks And 'Marks Server Started...");
});

// middleware: where all the middleware modules will go
// models: database schemas
// public: javascript/css (stylesheets directory) files
// routes: where all the route definitions will go
// views: where ejs files will go
