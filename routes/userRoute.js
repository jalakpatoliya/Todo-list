const express = require('express');
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const flash = require('connect-flash');

/**
 * Passport configs
 */
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // it reades, decodes information in session,encodes it
passport.deserializeUser(User.deserializeUser());

/**
 * User registeration form
 */
router.get("/register",
  // isLoggedIn, isAdmin,
  function (req, res) {
    res.render("register.ejs");
  })

/**
 * User regirsteratino request post
 */
router.post("/register", function (req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
    if (err) { // password is hashed by resiter and then saved in DB
      // res.send(err);
      req.flash('info', 'Flash is back!')
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () { // local can be replaced by twitter or fb
        res.redirect("/list/all");      //but here we are authenticating locally
      })
    }
  })
})


/**
 * Render login form
 */
router.get("/login", function (req, res) {
  res.render("login.ejs")
})

/**
 * Login post request
 */
router.post("/login", passport.authenticate("local", {
  successRedirect: "/list/all",
  failureRedirect: "/login"
}), function (req, res) { console.log(req.body.username); });



/**
 * Check if logged In or not
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("user is logged in");
    return next();
  }
  console.log("user is not logged in");
  res.redirect("/login");
}

/**
 * isAdmin Functiom
 */
function isAdmin(req, res, next) {
  console.log(req.user.username);
  if (req.isAuthenticated()) {
    console.log("isAdmin: user is logged in");
    User.findOne({ 'username': req.user.username }, function (err, data) {
      if (err) {
        console.log("findOne error");
        console.log(err);
      } else if (data.role == 'admin') {
        console.log(data.role);
        return next();
      } else { res.redirect("/login"); }
    })
  } else {
    console.log("isAdmin: is authenticated is false");
    res.redirect("/login");
  }
}


module.exports = router;
