var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Park    = require("../models/park"),
    Landmark    = require("../models/landmark"),
    Comment = require("../models/comment"),
    middleware = require('../middleware');

// ===================
// COMMENTS ROUTES FOR PARKS
// ===================
router.get("/parks/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // res.render("new"): we can't do this because we already have a new.ejs
    // therefore, we must refactor our file structure and add comments/campgrounds
    // to our views directory
    Park.findById(req.params.id, function(err, park) {
       if(err) { console.log("Error in comments/new [GET]"); }
       else {
           res.render("parks/new", {park: park});
       }
   });
});

router.post("/parks/:id/comments", middleware.isLoggedIn, function(req, res) {
    Park.findById(req.params.id, function(err, park) {
        if(err) {
            req.flash("error", "Sorry, something went wrong!");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
               if(err){
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   park.comments.push(comment);
                   park.save();
                   req.flash("success", "Your comment has successfully been added!");
                   res.redirect("/parks/" + park._id);
               }
           });
       }
   });
});

// COMMENT EDIT COMMENT PAGE ROUTE
router.get("/parks/:id/comments/:cid/edit", middleware.checkCommentPermission, function(req, res) {
    Comment.findById(req.params.cid, function(err, foundComment) {
        if(err) {
            console.log("There was an error in finding the comment");
            res.redirect("back");
        } else {
            // res.render() will look in a views folder for the view
            res.render("parks/edit", {pid: req.params.id, comment: foundComment});
        }
    })
});

// COMMENT EDIT COMMENT ROUTE
router.put("/parks/:id/comments/:cid", middleware.checkCommentPermission, function(req, res) {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Your comment has successfully been edited!");
            res.redirect("/parks/" + req.params.id);
        }
    });
});

// COMMENT DELETE ROUTE
router.delete("/parks/:id/comments/:cid", middleware.checkCommentPermission, function(req, res) {
    Comment.findByIdAndRemove(req.params.cid, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Your comment has successfully been deleted!");
            res.redirect("/parks/" + req.params.id);
        }
    });
});

// ===================
// COMMENTS ROUTES FOR LANDMARKS
// ===================
router.get("/landmarks/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // res.render("new"): we can't do this because we already have a new.ejs
    // therefore, we must refactor our file structure and add comments/campgrounds
    // to our views directory
    Landmark.findById(req.params.id, function(err, landmark) {
       if(err) { console.log("Error in comments/new [GET]"); }
       else {
           res.render("landmarks/new", {landmark: landmark});
       }
   });
});

router.post("/landmarks/:id/comments", middleware.isLoggedIn, function(req, res) {
    Landmark.findById(req.params.id, function(err, landmark) {
        if(err) {
            req.flash("error", "Sorry, something went wrong!");
            console.log("Error in comments/new [POST]");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
               if(err){
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   landmark.comments.push(comment);
                   landmark.save();
                   req.flash("success", "Your comment has successfully been added!");
                   res.redirect("/landmarks/" + landmark._id);
               }
           });
       }
   });
});

// COMMENT EDIT COMMENT PAGE ROUTE
router.get("/landmarks/:id/comments/:cid/edit", middleware.checkCommentPermission, function(req, res) {
    Comment.findById(req.params.cid, function(err, foundComment) {
        if(err) {
            console.log("There was an error in finding the comment");
            res.redirect("back");
        } else {
            // res.render() will look in a views folder for the view
            console.log(req.params.id);
            res.render("landmarks/edit", {lid: req.params.id, comment: foundComment});
        }
    })
});

// COMMENT EDIT COMMENT ROUTE
router.put("/landmarks/:id/comments/:cid", middleware.checkCommentPermission, function(req, res) {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Your comment has successfully been edited!");
            res.redirect("/landmarks/" + req.params.id);
        }
    });
});

// COMMENT DELETE ROUTE
router.delete("/landmarks/:id/comments/:cid", middleware.checkCommentPermission, function(req, res) {
    Comment.findByIdAndRemove(req.params.cid, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Your comment has successfully been deleted!");
            res.redirect("/landmarks/" + req.params.id);
        }
    });
});

module.exports = router;
