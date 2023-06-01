const Cart = require('../models/cart-model');

function initializeCart(req, res, next) {
    let cart;

    if(!req.session.cart) {
        cart = new Cart();
    } else {
        cart = new Cart(req.session.cart.item, req.session.cart.totalQuantity, req.session.cart.totalPrice);
    }

    res.locals.cart = cart;

    next();
}

module.exports = initializeCart;