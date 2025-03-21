const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const LinkedinStrategy = require('passport-linkedin-oauth2/lib').Strategy;
const methodOverride = require("method-override");
const User = require("./models/user");
const sass = require('node-sass');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const cors = require('cors');

const url = process.env.DATABASEURL;
const port = process.env.PORT;
const ip = process.env.IP;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use('local', new LocalStrategy(User.authenticate()));

mongoose.Promise = global.Promise;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('debug', true);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// ******** PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Everything is awesome",
    resave: false,
    saveUninitialized: false
}));
// ********* PASSPORT CONFIGURATION


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var jobRoutes = require("./routes/jobs"),
    indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users");

app.use("/", indexRoutes);
app.use("/jobs", jobRoutes);
app.use("/user", userRoutes);


//!!!!!!!!! Error Handling
app.get('*', wrapAsync(async function(req, res) {
  await new Promise(resolve => setTimeout(() => resolve(), 50));
  // Async error!
  throw new Error('Sorry, this page can\'t be found.');
}));

// Main image for website and thumbnails
var title = "Spencer Scott"
var ogImage = 'https://spencerscott.s3.eu-west-2.amazonaws.com/home-august-2019.jpg';
var ogDescription = 'A technology recruitment company.'

app.use(function(error, req, res, next) {
  // Gets called because of `wrapAsync()`
  // res.json({ message: error.message });
  res.render("error",{
      message: error.message,
      title: title,
      ogDesc: ogDescription,
      ogImage: ogImage
  });
});

function wrapAsync(fn) {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}


app.listen(port, ip, function() {
    console.log("Spencer Scott Website has started");
});