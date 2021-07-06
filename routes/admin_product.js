const express = require("express");
const router = express.Router();
const Product = require("../models/admin_product");
const Category = require('../models/category');
const wrapAsync = require("../controlError/wrapasync");
const AppError = require("../controlError/AppError");
const { isAdmin, isLoggedIn } = require("../middleware");
const multer = require('multer');
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");
const Cart = require("../models/cart");



router.get("/", wrapAsync(async (req, res, next) => {
    const products = await Product.find({});
    res.render("admin/products", { products });
    // console.log(JSON.stringify(products));
    // res.send(JSON.stringify(products));
}));


router.get('/add-product', isLoggedIn, isAdmin, (req, res, next) => {
    Category.find({})
        .then(categories => {
            res.render('admin/add_product', {
                categories: categories,

            })
        })
        .catch(err => next(err));
})




router.post("/add-product", isLoggedIn, isAdmin, upload.array("image"), async (req, res, next) => {
    try {

        const newProduct = new Product(req.body);
        newProduct.images = await req.files.map(f => ({ url: f.path, filename: f.filename }))


        await newProduct.save();
        req.flash('success', 'Successfully made a new product!');
        res.redirect("/admin/products");
    }
    catch (e) {
        next(e);
    }

});


router.get("/edit-product/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    const categories = await Category.find({});
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("admin/edit_adminproduct", { product, categories });
}));



router.put("/edit-product/:id", isLoggedIn, isAdmin, upload.array("image"), wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }


    Cart.find({ userId: req.user._id })
        .then(cart => {
            cart.forEach(async (p) => {
                if (p.products[0] == req.params.id) {
                    const cart = await Cart.findByIdAndUpdate(p._id,
                        { quantity: p.quantity, totalPrice: (product.price) * (p.quantity), runValidators: true, new: true });
                }
            })
        })


    req.flash('success', 'Successfully updated product!');
    res.redirect("/admin/products");

}));



router.get("/delete-product/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {

    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    for (let i = 0; i < deletedProduct.images.length; i++) {
        await cloudinary.uploader.destroy(deletedProduct.images[i].filename);
    }
    req.flash("success", "Product Deleted");
    res.redirect("/admin/products");
}));

module.exports = router;