const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { isAdmin, isLoggedIn } = require("../middleware");
const AppError = require("../controlError/AppError");
const wrapAsync = require("../controlError/wrapasync");
const wrapasync = require("../controlError/wrapasync");


router.get("/", async (req, res, next) => {
    try {
        const category = await Category.find({});
        // if (category.length === 0) {
        //     throw new AppError("page contain nothing!add first.", 200);
        // }
        res.render("admin/category", { category });

    }
    catch (e) {
        next(e);
    }
});



router.get("/add-category", wrapAsync(async (req, res, next) => {
    res.render("admin/add_category");

}));



router.post("/add-category", wrapAsync(async (req, res, next) => {


    // try {
    //     const newCateogry = new Category(req.body);
    //     if (!newCateogry.title) {
    //         throw new AppError("please fillup filled first", 200);
    //     }

    //     await newCateogry.save();
    //     req.flash('success', 'Successfully made a new product!');
    //     res.redirect("/admin/categories");
    // }
    // catch (e) {
    //     next(e);
    // }
    const newCateogry = new Category(req.body);
    if (!newCateogry.title) {
        throw new AppError("please fillup filled first", 200);
    }

    await newCateogry.save();
    req.flash('success', 'Successfully made a new category!');
    res.redirect("/admin/categories");

}));


router.get("/edit-category/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.render("admin/edit_category", { category });
}));



router.put("/edit-category/:id", wrapasync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash("success", "category updated");
    res.redirect("/admin/categories");


}));


router.get("/delete-category/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    req.flash("success", "category deleted");
    res.redirect("/admin/categories");
}));

module.exports = router;