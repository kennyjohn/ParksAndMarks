var express = require('express');
var router  = express.Router({mergeParams: true});
var User = require("../models/user");
var passport = require('passport');

// ROOT Route
router.get("/", function(req, res) {
    res.render("home");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    // create a new User object
    var newUser = new User({username: req.body.username});
    // registers the user into the database
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            // Error here if username is taken, etc...
            console.log("There was an issue during registration!");
            req.flash("error", err.message + "!");
            return res.redirect("/register");
        } else {
            // "local" is a part of the documentation
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Successfully registered. Welcome to Parks and 'Marks!");
                res.redirect("/");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("back");
});

module.exports = router;
