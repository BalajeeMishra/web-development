const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
        procuctId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
        title: String,
        price: Number
})

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        products: [ProductSchema],
        totalPrice: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true
        },
        modifiedOn: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);