if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const AppError = require("./controlError/AppError");
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



const Categories = require("./routes/admin_categories");
const Pages = require("./routes/pages")
const Product = require("./routes/admin_product");
const Users = require("./routes/user");
const admin_pages = require("./routes/admin_pages");
const Userproduct = require("./routes/product")


mongoose.connect('mongodb://localhost:27017/shoppingcart', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const app = express();

// app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: !false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//routes part.
app.use("/admin/products", Product);
app.use("/admin/pages", admin_pages);
app.use("/admin/categories", Categories);
app.use("/users", Users);
app.use("/", Pages);
app.use("/product", Userproduct);


const handleValidationErr = err => {
    // console.dir(err);
    return new AppError(`Validation Failed...${err.message}`, 400)
}

app.use((err, req, res, next) => {
    // console.log(err.name);
    //We can single out particular types of Mongoose Errors:
    if (err.name === 'ValidationError') err = handleValidationErr(err)
    next(err);
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    console.log(message);
    if (err) {
        res.status(statusCode).render('error', { err })
    }

});


// app.get('*', (req, res, next) => {
//     res.locals.cart = req.session.cart;
//     console.log(res.locals.cart)
//     console.log(req.session.cart)
//     // res.locals.user = req.user || null;
//     next();
// });


app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})