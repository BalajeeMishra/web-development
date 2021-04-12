const mongoose = require("mongoose");
const listSchema = new mongoose.Schema({
    list: {
        type: String,
        required: true

    },
    time: {
        type: Number,
        required: true,
        min: 0
    }

})
const Routine = mongoose.model("Routine", listSchema);
module.exports = Routine;