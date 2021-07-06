const express = require("express");
const router = express.Router();
const Page = require("../models/page");
const AppError = require("../controlError/AppError");
const { isAdmin, isLoggedIn } = require("../middleware");
const wrapAsync = require("../controlError/wrapasync");



router.get("/", async (req, res, next) => {
    try {
        const pages = await Page.find({});
        // if (pages.length === 0) {
        //     throw new AppError("page contain nothing!add first.", 200);
        // }
        res.render("admin/pages", { pages });
    }

    catch (e) {
        next(e);
    }
});




router.get("/add-page", async (req, res, next) => {
    try {
        res.render("admin/add_page");
    }
    catch (e) {
        next(e);
    }

});


router.post("/add-page", async (req, res, next) => {
    try {
        const newPage = new Page(req.body);
        if (!newPage.title || !newPage.content) {
            throw new AppError("please fillup filled first", 200);
        }
        await newPage.save();
        req.flash('success', 'Successfully made a new page!');
        res.redirect("/admin/pages");
    }
    catch (e) {
        next(e);
    }

});




router.get("/edit-page/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const page = await Page.findById(id);
    res.render("admin/edit_page", { page });
}));





router.put("/edit-page/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const page = await Page.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        req.flash('success', 'Successfully updated page!');
        res.redirect("/admin/pages");
    }
    catch (e) {
        next(e);
    }
});




router.get("/delete-page/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletePage = await Page.findByIdAndDelete(id);
        req.flash("success", "page deleted");
        res.redirect("/admin/pages");
    }
    catch (e) {
        next(e);
    }
});

module.exports = router;