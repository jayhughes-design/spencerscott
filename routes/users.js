const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");


const ipfilter = require('express-ipfilter').IpFilter;
// Whitelist the following IPs
var ips = ['86.150.100.153'];

// Main image for website and thumbnails
var title = "Spencer Scott"
var ogImage = 'http://www.spencerscott.london/img/new-landing.jpg';
var ogDescription = 'A technology recruitment company.'

// Show user edit screen
router.get("/", function(req, res) {

    res.render("users/edit", {
        title: title,
        ogImage: ogImage,
        ogDesc: ogDescription,
    });
});


// update user edit screen
router.put("/:id", function(req, res) {

    var image = req.body.user.image;
    var firstName = req.body.user.firstName;
    var lastName = req.body.user.lastName

    var conditions = {
     _id : req.user._id, 
    }

    // Keeping this here as it's handy.
   
    // var update = {
    //     firstName = sanitizeHtml(req.body.firstName );
    //     lastName = sanitizeHtml(req.body.lastName);
    //     studentId = sanitizeHtml(req.body.studentId);
    //     email = sanitizeHtml(req.body.email);
    //     password = sha512(req.body.password).toString('hex');
    // }

    var upUser = {
        image: image,
        firstName: firstName,
        lastName: lastName
    }
   
    User.findOneAndUpdate(conditions,upUser,function(error,result){
       if(error){
         // handle error
       }else{
        req.logout();
        req.flash("success", "Your profile was updated " + result.firstName + ". Please sign back in.");
        res.redirect("/");
       }
     });
});

module.exports = router;