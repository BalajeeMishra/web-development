const express = require("express");
const app = express();
const path = require("path");
const Routine = require("./models/routine");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
mongoose.connect("mongodb://localhost:27017/todoapp", { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log("connection open");

    })
    .catch(() => {
        console.log(err);
    })
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.get("/routine", async (req, res) => {
    const routine = await Routine.find({})
    res.render("routine/index", { routine });
})
app.get("/routine/new", async (req, res) => {
    res.render("routine/new")
});
app.post("/routine", async (req, res) => {
    console.log(req.body);
    const newRoutine = new Routine(req.body);
    await newRoutine.save();
    res.redirect("/routine");
})
app.delete("/routine/:id", async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Routine.findByIdAndDelete(id);
    res.redirect("/routine");
    console.log("balajee");
})
app.listen(3000, () => {
    console.log("connection made");
});
