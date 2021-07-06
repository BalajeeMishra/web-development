const express = require("express");
const router = express.Router();
const Product = require("../models/admin_product");
const Page = require("../models/page");
const Categories = require("../models/category");
const User = require("../models/user");
const Cart = require("../models/cart");
const { isAdmin, isLoggedIn } = require("../middleware");


var product, page;
Product.find((err, pro) => {
    showProduct(pro);
})
function showProduct(pro) {
    product = pro
}

Page.find((err, pages) => {
    showPage(pages);
})
function showPage(p) {
    page = p;
}

router.get('/', (req, res) => {
    // console.log(product);

    // Page.find((err, page) => {
    //     // console.log(page)
    //     if (err)
    //         console.log(err);
    res.render('index', {
        page, product
    });
});


router.get("/products", (req, res) => {
    Categories.find((err, category) => {
        // console.log(product);
        res.render("all_product", {
            category,
            product,
            page
        })
    })
})
router.get("/products/:id", async (req, res) => {

    const product = await Product.findById(req.params.id);
    res.render("show", { product, page });

})
router.post("/cart/:id", isLoggedIn, (req, res, next) => {
    // console.log(req.user);

    const product = Product.findById(req.params.id)
        .then().catch(err => next(err));
    const { _id, title, price } = product
    // console.log(product);

    let cart = false;
    // let cart = await Cart.findOne(req.user._id);
    if (cart) {
        const existingProductIndex = cart.products.findIndex(p => p._id == _id);
        if (existingProductIndex >= 0) {
            const existingProduct = cart.products[existingProductIndex];
            existingProduct.quantity += 1
            cart.totalPrice += product.price
        }
        else {
            //product does not exists in cart, add new item
            cart.products.push({ _id, quantity, title, price });
        }

    }
    else {
        const addCart = new Cart({ userId: req.user._id, products: [product] });
        const quantity = addCart.products.length

        addCart.save()
        .then(() =>{
            Cart.find((err, pro) => {
                console.log(pro);
            });
            res.redirect('/')
        })
        .catch(err => next(err))
    }
});
module.exports = router;
