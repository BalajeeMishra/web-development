
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        // required: true
    },

    slug: {
        type: String
    },
    // images: [
    //     {
    //         url: String,
    //         filename: String

    //     }

    // ]
    images: [ImageSchema]
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;