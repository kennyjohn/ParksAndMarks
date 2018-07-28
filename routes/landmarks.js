var express = require('express'),
    Landmark    = require('../models/landmark'),
    Submission = require('../models/submission'),
    router  = express.Router({mergeParams: true}),
    middleware = require('../middleware');

router.get("/", function(req, res) {
    // res.render("landmarks/index");
    Landmark.find({}, function(err, landmarks) {
        if(err) { console.log("Error in /campgrounds [GET]"); }
        else {
            res.render("landmarks/index", {landmarks: landmarks});
            // validUser: req.user
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    // access the landmarkSchema keys here
    var name = req.body.name,
        image = req.body.image,
        description = req.body.description,
        author = req.user;
    // req.user is undefined if there is no user loggined in
    // after establishing all variables, enter the entry into DB
    var newlandmark = {name:name, image:image, description:description, author: author};
    Submission.create(newlandmark, function(err, landmark) {
        // landmark object gives _id, name, image, etc.
        if(err) { console.log("Error in /landmarks [POST]"); }
        else {
            landmark.author.id = req.user._id;
            landmark.author.username = req.user.username;
            landmark.save();
            res.redirect("/landmarks");
        }
    });
});

router.get("/upload", middleware.isLoggedIn, function(req, res) {
    res.render("landmarks/upload");
});

router.get("/:id", function(req, res) {
    var id = req.params.id;
    // e.g. ():id, :example, :anotherparam) would all be in the params object
    Landmark.findById(id).populate("comments").exec(function(err, foundlandmark) {
       if(err) { console.log(err); }
       else {
           res.render("landmarks/landmark", {landmark: foundlandmark});
       }
    });
});

module.exports = router;
