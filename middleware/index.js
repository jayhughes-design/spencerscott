var Job = require("../models/job");
// var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkJobOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Job.findById(req.params.id, function(err, foundJob) {
            if (err) {
                req.flash("error", "Job not found");
                res.redirect("back");
            } else {
                // Is the user a super admin? Jay Hughes & Spencer Pratchett
                if (req.user._id === '5d5da573ebd3cd0022bc602b' || req.user._id === '5acbc71721d27c0020f5d6ac' || req.user._id === '62e93962b6ec2f0025661f25') {
                    next();
                    // Else if the author is the owner
                } else if (foundJob.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You need to be the author of this job to perform that task.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isLocal = function(req, res, next) {
    var env = "";
    if (process.env.HOST === "http://localhost") {
        var env = "local";
        return env;
    } else {
        var env = "prod";
        return env;
    }
}

module.exports = middlewareObj;