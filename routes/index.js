const express = require("express");
const router = express.Router();
const passport = require("passport");
const job = require("../models/job");
const User = require("../models/user");
const middleware = require("../middleware");


const ipfilter = require('express-ipfilter').IpFilter;
// Whitelist the following IPs
var ips = ['86.150.100.153'];

// Main image for website and thumbnails
var title = "Spencer Scott"
var ogImage = 'http://www.spencerscott.london/img/new-landing.jpg';
var ogDescription = 'A technology recruitment company.'

function getAllJobs(string, res, title) {

    job.find({}, function(err, alljobs) {
        if (err) {
            console.log(err);
        } else {
            res.render(string, {
                title: title,
                ogImage: ogImage,
                ogDesc: ogDescription,
                jobs: alljobs,
                env: middleware.isLocal()
            });
        }
    });
}

//root route
router.get("/", function(req, res) {
    getAllJobs("landing", res, "Spencer Scott");
});

//root route
router.get("/error", function(req, res) {
    getAllJobs("error", res, "Page not found | Spencer Scott");
});

//root route
router.get("/terms-conditions", function(req, res) {
    getAllJobs("terms-conditions", res, "Terms and conditions | Spencer Scott");
});

//root route
router.get("/privacy-policy", function(req, res) {
    getAllJobs("privacy-policy", res, "Privacy policy | Spencer Scott");
});

// show register form
router.get("/register", function(req, res) {
    getAllJobs("register", res, "Register | Spencer Scott");
});

// show join us
router.get("/join", function(req, res) {
    getAllJobs("join", res, "Join us | Spencer Scott");
});

// show about us
router.get("/about", function(req, res) {
    getAllJobs("about", res, "About us | Spencer Scott");
});

// show team 
router.get("/team", function(req, res) {
    getAllJobs("team", res, "Meet the team | Spencer Scott");
});

// show contact us
router.get("/contact", function(req, res) {
    getAllJobs("contact", res, "Contact us | Spencer Scott");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err.message);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Spencer Scott " + user.username);
            res.redirect("/");
        });
    });
});

router.get("/api/user_data", function(req, res) {
    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            username: req.user
        });
    }
});

//show login form
// router.get("/login", ipfilter(ips, {mode: 'allow'}), function(req, res){
router.get("/login", function(req, res) {
    res.render("login", {
        user: req.user,
        title: title,
        ogImage: ogImage,
        ogDesc: ogDescription
    });
});

//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/jobs");
});


module.exports = router;