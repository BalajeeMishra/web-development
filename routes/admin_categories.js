const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { isAdmin, isLoggedIn } = require("../middleware");
const AppError = require("../controlError/AppError");
const wrapAsync = require("../controlError/wrapasync");


router.get("/", wrapAsync(async (req, res, next) => {
    try {
        const category = await Category.find({});
        res.render("admin/category", { category });
        throw new AppError("something went wrong", 400);
    }
    catch (e) {
        next(e);
    }
}));

router.get("/add-category", wrapAsync(async (req, res, next) => {
    res.render("admin/add_category");

}));

router.post("/add-category", async (req, res, next) => {
    const newCategory = new Category(req.body);
    if (!newCategory.title) {
        return next(new AppError("hey you", 200));
    }
    await newCategory.save();
    res.redirect("/admin/categories");
    // try {
    //     const newCateogry = new Cateogry(req.body);
    //     if (!newCateogry.title || !newCateogry.slug) {
    //         throw new AppError("hey you", 200);
    //     }

    //     await newCateogry.save();
    //     req.flash('success', 'Successfully made a new product!');
    //     res.redirect("/admin/categories");
    // }
    // catch (e) {
    //     next(e);
    // }

});
router.get("/edit-category/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.render("admin/edit_category", { category });
}));

router.put("/edit-category/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect("/admin/categories");

}));
router.get("/delete-category/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.redirect("/admin/categories");
}));

module.exports = router;