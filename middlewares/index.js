
var middleware = {};

middleware.isLoggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash("error", "Please login first!")
        res.redirect("/login");
    }
}

module.exports = middleware;
