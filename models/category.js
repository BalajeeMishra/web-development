const mongoose = require("mongoose");
const CateogrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        // required: true
    }
});
const Cateogry = mongoose.model("Cateogry", CateogrySchema);
module.exports = Cateogry;