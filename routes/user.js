const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Page = require("../models/page");
const AppError = require("../controlError/AppError");
const wrapAsync = require("../controlError/wrapasync");
//authentication related
// const LocalStrategy = require("passport-local");
// const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

//use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());//encode session
// passport.deserializeUser(User.deserializeUser());//decode session
// // use static authenticate method of model in LocalStrategy
// passport.use(new LocalStrategy(User.authenticate()));



router.get("/", async (req, res) => {
    User.find((err, pro) => {
        console.log(pro);
    });

});

router.get("/register", wrapAsync(async (req, res, next) => {
    res.render("register", { title: "register" });

}));

router.post("/register", wrapAsync(async (req, res, next) => {

    try {
        const { name, email, username, password } = req.body;
        const user = new User({ name, email, username });
        const registeredUser = await User.register(user, password);
        console.log(req.user);//mritu why this is not printed anything
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            // res.redirect('/admin/products');
            res.redirect('/');
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/users/register");
    }

}))


router.get("/login", (req, res) => {

    res.render("login");
});
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    req.session.admin = req.user.admin;
    if (req.body.username != "bala") {
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
    else {
        const redirectUrl = req.session.returnTo || '/admin/products';
        delete req.session.returnTo;
        res.redirect("/");
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "GoodBye!");
    res.redirect("/");
});
module.exports = router;