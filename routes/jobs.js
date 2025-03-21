const express = require("express");
const app = express();
const aws = require('aws-sdk');
const router = express.Router();
const job = require("../models/job");
const User = require("../models/user");
const middleware = require("../middleware");
const passport = require("passport");
const cors = require("cors");

const ipfilter = require('express-ipfilter').IpFilter;
// Whitelist the following IPs
var ips = ['86.150.100.153'];

const S3_BUCKET = process.env.S3_BUCKET;

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


//INDEX - show all jobs
router.get("/", function(req, res) {
    job.find({}, function(err, alljobs) {
        if (err) {
            console.log(err);
        } else {
            res.render("jobs/index", {
                jobs: alljobs,
                user: req.user,
                env: middleware.isLocal(),
                title: 'All jobs | Spencer Scott',
                ogImage: ogImage,
                ogDesc: ogDescription
            });
        }
    });
});


// ADMIN
router.get("/admin", middleware.isLoggedIn, function(req, res) {
    job.find({}, function(err, alljobs) {
        if (err) {
            console.log(err);
        } else {
            res.render("jobs/admin", {
                jobs: alljobs,
                user: req.user,
                env: middleware.isLocal(),
                title: 'All jobs | Spencer Scott',
                ogImage: ogImage,
                ogDesc: ogDescription
            });
        }
    });
});

// DESTROY job ROUTE
router.delete("/admin/:id", middleware.checkJobOwnership, function(req, res) {

    var query = req.params.id;
    if (query.match(/^[0-9a-fA-F]{24}$/)) {
        job.findByIdAndRemove(query, function(err) {
            if (err) {
                res.redirect("/jobs/admin");
            } else {
                req.flash("success", "Job successfully deleted");
                res.redirect("/jobs/admin");

            }
        });
    } else {
        job.findOneAndRemove(query, function(err) {
            if (err) {
                res.redirect("/jobs/admin");
            } else {
                req.flash("success", "Job successfully deleted");
                res.redirect("/jobs/admin");

            }
        });
    }
});


//CREATE - add new job to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to jobs array
    var title = req.body.title;
    var image = req.body.image;
    var role = req.body.role;
    var location = req.body.location;
    var term = req.body.term;
    var slug = req.body.slug;
    var price = req.body.price;
    var desc = req.body.description;
    var ogDesc = req.body.ogDesc;
    var preview = req.body.preview;

    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newjob = {
        title: title,
        image: image,
        slug: slug,
        role: role,
        location: location,
        term: term,
        price: price,
        description: desc,
        author: author,
        ogDesc: ogDesc,
        preview: preview
    }

    // Create a new job and save to DB
    job.create(newjob, function(err, newlyCreated) {

        if (err) {
            console.log(err);
        } else {
            //redirect back to jobs page
            res.redirect("/jobs");
        }
    });


});

router.get("/new", middleware.isLoggedIn, async(req, res) => {

    let allJobs;
    allJobs = await job.find({});

    try {

        res.render("jobs/new", {
            title: 'New Job | Spencer Scott',
            ogImage: ogImage,
            ogDesc: ogDescription,
            jobs: allJobs,
            env: middleware.isLocal()
        });
    } catch (err) {
        return res.status(500).send(err);
    }

});


// EDIT job ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkJobOwnership, async(req, res) => {

    let urlValue = req.params.id;
    let allJobs;
    allJobs = await job.find({});

    job.findById(urlValue, function(err, foundJob) {
        if (err) {
            console.log(err);
        } else {
            res.render("jobs/edit", {
                job: foundJob,
                jobs: allJobs,
                title: 'Edit job | Spencer Scott',
                ogImage: ogImage,
                ogDesc: ogDescription,
                env: middleware.isLocal()
            });
        }
    });

});

router.get("/:id", async(req, res) => {

    let urlValue = req.params.id;
    let allJobs;

    allJobs = await job.find({});

    if (urlValue.match(/^[0-9a-fA-F]{24}$/)) {

        job.findById(urlValue, function(err, foundJob) {
            if (err) {
                console.log(err);
            } else {

                if (foundJob.image) {
                    var seoImage = foundJob.image;
                } else {
                    var seoImage = ogImage;
                }

                res.render("jobs/show", {
                    job: foundJob,
                    jobs: allJobs,
                    env: middleware.isLocal(),
                    title: foundJob.title + ' | Spencer Scott',
                    ogImage: ogImage,
                    ogDesc: foundJob.ogDesc
                });
            }
        });

    } else {

        job.findOne({
            slug: urlValue
        }, function(err, foundJob) {
            if (err) {
                console.log(err);
            } else {

                if (foundJob) {

                    var seoImage = foundJob.image || ogImage;

                    res.render("jobs/show", {
                        job: foundJob,
                        jobs: allJobs,
                        env: middleware.isLocal(),
                        title: foundJob.title + ' | Spencer Scott',
                        ogImage: seoImage,
                        ogDesc: foundJob.ogDesc
                    });
                } else {
                    res.render("error", {
                        message: 'Sorry, there\'s no job found.',
                        title: title,
                        ogDesc: ogDescription,
                        ogImage: ogImage
                    });
                }
            }
        });
    }
});

// UPDATE job ROUTE
router.put("/:id", middleware.checkJobOwnership, function(req, res) {

    var title = req.body.job.title;
    var image = req.body.job.image;
    var role = req.body.job.role;
    var location = req.body.job.location;
    var term = req.body.job.term;
    var slug = req.body.job.slug;
    var price = req.body.job.price;
    var desc = req.body.job.description;
    var ogDesc = req.body.job.ogDesc;
    var preview = req.body.job.preview;

    var author = {
        id: req.user._id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        image: req.user.image
    }

    console.log(author);

    var upJob = {
        title: title,
        image: image,
        slug: slug,
        role: role,
        location: location,
        term: term,
        price: price,
        description: desc,
        ogDesc: ogDesc,
        preview: preview,
        author: author
    }

    console.log(upJob);

    var query = req.params.id;

    job.findByIdAndUpdate(query, upJob, function(err, updatedjob) {
        if (err) {
            res.redirect("/jobs");
        } else {
            if (slug !== "") {
                res.redirect("/jobs/" + slug);
            } else {
                res.redirect("/jobs/" + query);
            }
        }
    });
});

// DESTROY job ROUTE
router.delete("/:id", middleware.checkJobOwnership, function(req, res) {

    var query = req.params.id;
    if (query.match(/^[0-9a-fA-F]{24}$/)) {
        job.findByIdAndRemove(query, function(err) {
            if (err) {
                res.redirect("/jobs");
            } else {
                res.redirect("/jobs");
            }
        });
    } else {
        job.findOneAndRemove(query, function(err) {
            if (err) {
                res.redirect("/jobs");
            } else {
                res.redirect("/jobs");
            }
        });
    }

});


//root route
router.get("/error", function(req, res) {
    getAllJobs("error", res, "Page not found | Spencer Scott");
});

module.exports = router;