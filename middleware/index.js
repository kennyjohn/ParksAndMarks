// REQUIRE MODELS
var Park = require("../models/park");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
         // calling next will proceed to calling the callback function.
    }
    req.flash("error", "You need to be logged in first! :)");
    res.redirect("/login");
        // otherwise, it skips the callback function and redirects.
};

middlewareObj.checkCommentPermission = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.cid, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                var currentUserID = req.user._id.toString();
                if(foundComment.author.id == currentUserID) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first! :)");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
