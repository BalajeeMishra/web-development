const express = require("express");
// const { findByIdAndDelete } = require("../models/page");
const router = express.Router();
const Page = require("../models/page");
const AppError = require("../controlError/AppError");
const { isAdmin, isLoggedIn } = require("../middleware");
const wrapAsync = require("../controlError/wrapasync");


router.get("/", async (req, res, next) => {
    try {
        const pages = await Page.find({});
        res.render("admin/pages", { pages });
        throw new AppError("cant find all product", 404);
    }
    catch (e) {
        next(e);
    }
});


router.get("/add-page", async (req, res, next) => {
    try {
        const title = "";
        const slug = "";
        const content = "";
        res.render("admin/add_page", {
            title: title,
            slug: slug,
            content: content
        })
        throw new AppError("we nedd more components", 404);
    }
    catch (e) {
        next(e);
    }

});

router.post("/add-page", async (req, res, next) => {

    // res.render("admin/add_page", {
    //     title: title,
    //     slug: slug,
    //     content: content
    // });
    try {
        const newPage = new Page(req.body);
        await newPage.save();
        res.redirect("/admin/pages");
        throw new AppError("posting is not possible", 404);
    }
    catch (e) {
        next(e);
    }

});



router.get("/edit-page/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const page = await Page.findById(id);
        res.render("admin/edit_page", { page });
        throw new AppError("required something", 401);
    }
    catch (e) {
        next(new AppError(e));
    }

})

router.put("/edit-page/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("balajee");
        const page = await Page.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
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
        res.redirect("/admin/pages");
    }
    catch (e) {
        next(e);
    }
});



module.exports = router;