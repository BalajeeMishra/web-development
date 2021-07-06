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



router.get("/", wrapAsync(async (req, res, next) => {
    const products = await Product.find({});
    res.render("admin/products", { products });
}));


router.get('/add-product', isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    // const title = "";
    const desc = "";
    const price = "";
    Category.find((err, categories) => {
        console.log(categories)
        res.render('admin/add_product', {
            // title: title,
            desc: desc,
            categories: categories,
            price: price
        });

    }).then(err => next(err))
}));

router.post("/add-product", isLoggedIn, isAdmin, upload.array("image"), (req, res, next) => {
    const newProduct = new Product(req.body);
    console.log(newProduct.category)
    newProduct.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // console.log(req.files);
    if (!newProduct.title || !newProduct.desc || !newProduct.price) {
        return next(new AppError("please fill up all field", 400));

    }

    newProduct.save();
    req.flash('success', 'Successfully made a new product!');
    res.redirect("/admin/products");
    console.log(req.body.category);//I cant see category value.

});

router.get("/edit-product/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'Cannot find that campground!');
        // throw new AppError('Product Not Found', 404);       
    }
    res.render("admin/edit_adminproduct", { product });
}));

router.put("/edit-product/:id", isLoggedIn, isAdmin, upload.array("image"), wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    // console.log(product);
    await product.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect("/admin/products");

}));

router.get("/delete-product/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res, next) => {

    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    for (let i = 0; i < deletedProduct.images.length; i++) {
        await cloudinary.uploader.destroy(deletedProduct.images[i].filename);
    }
    res.redirect("/admin/products");
}));

module.exports = router;