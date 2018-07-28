var express = require('express'),
    Park    = require('../models/park'),
    Submission = require('../models/submission'),
    router  = express.Router({mergeParams: true}),
    middleware = require('../middleware');

router.get("/", function(req, res) {
    // res.render("parks/index");
    Park.find({}, function(err, parks) {
        if(err) { console.log("Error in /campgrounds [GET]"); }
        else {
            res.render("parks/index", {parks: parks});
            // validUser: req.user
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    // access the parkSchema keys here
    var name = req.body.name,
        image = req.body.image,
        description = req.body.description,
        author = req.user;
    // req.user is undefined if there is no user loggined in
    // after establishing all variables, enter the entry into DB
    var newPark = {name:name, image:image, description:description, author: author};
    Submission.create(newPark, function(err, park) {
        // park object gives _id, name, image, etc.
        if(err) { console.log("Error in /parks [POST]"); }
        else {
            park.author.id = req.user._id;
            park.author.username = req.user.username;
            park.save();
            res.redirect("/parks");
        }
    });
});

router.get("/upload", middleware.isLoggedIn, function(req, res) {
    res.render("parks/upload");
});

router.get("/:id", function(req, res) {
    var id = req.params.id;
    // e.g. ():id, :example, :anotherparam) would all be in the params object
    Park.findById(id).populate("comments").exec(function(err, foundPark) {
       if(err) { console.log(err); }
       else {
           res.render("parks/park", {park: foundPark});
       }
    });
});

module.exports = router;
