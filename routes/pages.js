const express = require("express");
const router = express.Router();
const Product = require("../models/admin_product");
const Page = require("../models/page");
const Categories = require("../models/category");
const User = require("../models/user");
const Cart = require("../models/cart");
const { isAdmin, isLoggedIn } = require("../middleware");
const { createCollection } = require("../models/admin_product");
const wrapAsync = require("../controlError/wrapasync");
const AppError = require("../controlError/AppError");



router.get('/', wrapAsync(async (req, res) => {
    const page = await Page.find({});
    const product = await Product.find({});
    if (typeof req.user !== "undefined") {
        var carts = await Cart.find({ userId: req.user._id });
    }

    Categories.find((err, category) => {

        res.render("index", {
            category,
            product,
            page,
            carts,
            admin: req.session.admin

        })
    })

}));




router.get("/:title", wrapAsync(async (req, res) => {
    const title = req.params.title;
    const page = await Page.find({});
    const product = await Product.find({});
    if (typeof req.user !== "undefined") {
        var carts = await Cart.find({ userId: req.user._id });
    }
    if (title === "products") {
        // res.writeHead(302, { location: '/' });
        Categories.find((err, category) => {
            res.render("all_product", {
                category,
                product,
                page,
                carts,
                admin: req.session.admin

            })
        })

    }

    else {
        res.render("explanation", {
            page,
            title,
            admin: req.session.admin
        });
    }

}));


router.get("/by/categorys", wrapAsync(async (req, res) => {
    const page = await Page.find({});
    const product = await Product.find({});
    if (typeof req.user !== "undefined") {
        var carts = await Cart.find({ userId: req.user._id });
    }


    Categories.find((err, category) => {
        res.render("all_category", {
            category,
            product,
            page,
            carts,
            admin: req.session.admin

        })
    })
}));


router.get("/products/:id", wrapAsync(async (req, res) => {
    const page = await Page.find({});
    const product = await Product.findById(req.params.id);
    res.render("show", { product, page, admin: req.session.admin });

}));





router.get("/cart/:id", isLoggedIn, wrapAsync(async (req, res, next) => {
    var count = 0, addCart = 0


    // for going back to 
    const backURL = req.header('Referer') || '/';
    const product = await Product.findById(req.params.id);

    Cart.findOne({ userId: req.user._id })
        .then((c) => {
            if (c) {

                Cart.find({ userId: req.user._id })
                    .then(cart => {

                        if (cart) {

                            cart.forEach(async (p) => {

                                if (p.products[0] == req.params.id) {
                                    await Cart.findByIdAndUpdate(p._id,
                                        { quantity: p.quantity + 1, totalPrice: p.totalPrice + product.price }, (err, result) => {

                                            if (err) {
                                                console.log(err);
                                            }


                                        });

                                    if (backURL == "http://localhost:3000/all/mycart") {
                                        res.redirect(backURL);
                                    }
                                    else {
                                        res.send("okay")
                                    }



                                }
                            })

                            cart.forEach((p) => {
                                if (p.products[0] != req.params.id) {
                                    count += 1;
                                    if (count == cart.length) {
                                        addCart = new Cart({ userId: req.user._id, products: [req.params.id], quantity: 1 });
                                        addCart.totalPrice = product.price;
                                        addCart.save()
                                            .then(() => {
                                                req.flash("success", "product added");
                                                res.redirect("/products");
                                            })
                                            .catch(err => next(err));

                                    }
                                }

                            })
                        }

                        else {
                            console.log("balajee");
                        }


                    })

                    .catch(err => next(err))

            }

            else {

                console.log("balajee");
                addCart = new Cart({ userId: req.user._id, products: [req.params.id], quantity: 1 });
                addCart.totalPrice = product.price;
                console.log("mishra");
                addCart.save()
                    .then(() => {
                        req.flash("success", "product added");
                        res.redirect("/products");
                    })
                    .catch(err => next(err));

            }

        })


        .catch(err => next(err))


}));

router.get("/blank/CART", wrapAsync((req, res) => {
    // req.flash("error", "your cart is empty!Go for shopping first!");
    res.render("blankCart");
}));



router.get("/all/mycart", isLoggedIn, wrapAsync(async (req, res) => {
    const Total = 0;
    const qty = 0;
    const products = await Product.find({});
    const page = await Page.find({});
    // console.log(products);
    Cart.find({ userId: req.user._id })

        .then(carts => {
            if (typeof carts === "undefined" || carts.length == 0) {
                req.flash("error", "your cart is empty!Go for shopping first!");
                res.redirect("/blank/CART");
            }
            else {
                res.render("mycart", {
                    carts,
                    page,
                    products,
                    Total,
                    qty,
                    admin: req.session.admin

                })
            }
        })
        .catch(e => next(e));

}));




router.get("/mycart/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    var carts = await Cart.find({ userId: req.user._id });
    // if (carts.length ==)
    const deletedCart = await Cart.findByIdAndDelete(id);
    res.redirect("/all/mycart");
}));






router.get("/carts/:id", isLoggedIn, wrapAsync(async (req, res) => {

    const backURL = req.header('Referer') || '/';
    const product = await Product.findById(req.params.id);
    console.log(req.params.id);
    Cart.find({ userId: req.user._id })
        .then(async (cart) => {
            if (cart) {
                console.log(cart.length);
                cart.forEach(async (p) => {
                    if (p.products[0] == req.params.id) {
                        console.log(p.quantity);
                        if (p.quantity > 1) {
                            console.log("balajee");
                            await Cart.findByIdAndUpdate(p._id,
                                { quantity: p.quantity - 1, totalPrice: p.totalPrice - product.price }, (err, result) => {

                                    if (err) {
                                        console.log(err);
                                    }


                                });

                            if (backURL == "http://localhost:3000/all/mycart") {
                                res.redirect(backURL);
                            }
                            else {
                                res.send("okay")
                            }

                        }
                    }
                    console.log("balajee");
                    const { id } = req.params;
                    console.log(id);
                    const deletedCart = await Cart.findByIdAndDelete(id);
                    console.log(deletedCart);
                    res.redirect("/all/mycart");

                })
            }

        })
        .catch(e => next(e));
}));



module.exports = router;