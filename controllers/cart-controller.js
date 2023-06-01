const Product = require('../models/product-model');

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res) {
    let product;

    try {
        product = await Product.findById(req.body.productId);
    } catch(error) {
        next(error);
        return;
    }

    let cart = res.locals.cart;

    cart.addItem(product);
    req.session.cart = cart;
    
    res.json({
        message: 'Cart Updated!', 
        totalCartQuantity: cart.totalQuantity
    });
}

function updateCartItem(req, res) {
    let cart = res.locals.cart;

    const updatedData = cart.updateItem(req.body.productId, req.body.quantity);

    req.session.cart = cart;

    res.json({
        message: 'Item Updated!',
        updatedCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedData.updatedItemPrice
        }
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCartItem: updateCartItem
}