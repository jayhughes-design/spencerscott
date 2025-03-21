// import package
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// create a User schema
var UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   image: String,
   firstName: String,
   lastName: String
});

UserSchema.plugin(passportLocalMongoose); // adding method to user

// export the model
module.exports = mongoose.model("User", UserSchema);