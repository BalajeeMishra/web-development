
const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const Cart = require("../models/cart");
var priced = 0;
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AaDj1YMVe67NhG_QpfHP9gHqAFkk39joVHT6FXvPYWdJv91gbARHR-zq55BIYjVGY2ElUzo5F77EHo7l',
    'client_secret': 'EMz97ri2AOTA06J4SIcORBpaQK4FrZOYI9RvLKLlwuzNO6dnpUY5L5O05gbaQGrX2xdls9UqIgTVny1G'
});


router.get('/success/success', (req, res) => {
    console.log("successs");
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("mritunjay");
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": priced
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {

        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            await Cart.deleteMany({});
            req.flash("success", " order placed ");
            res.redirect("/");
        }
    });
});



router.post('/pay', (req, res) => {
    priced = parseInt(req.body.price);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://companyofmarket.herokuapp.com/success/success",
            "cancel_url": "https://companyofmarket.herokuapp.com/cancel/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": parseInt(req.body.price),
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": parseInt(req.body.price)
            },
            "description": "Hat for the best team ever"
        }]

    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});


router.get('/cancel/cancel', (req, res) => {
    req.flash("error", "payment cancelled try again");
    res.redirect("/");

})
module.exports = router;