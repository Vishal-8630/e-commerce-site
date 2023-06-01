const Order = require('../models/order-model');
const User = require('../models/user-model');

async function getOrder(req, res, next) {
    try {
        const orders = await Order.findAllForUser(res.locals.uid);
        res.render('customer/orders/all-orders', {orders: orders});

    } catch(error) {
        next(error);
    }
}

async function addOrder(req, res) {
    const cart = req.session.cart;

    let userData;

    try{
        userData = await User.getUserById(res.locals.uid);
    } catch(error) {
        return next(error);
    }

    const order = new Order(cart, userData);

    try {
        await order.save();
    } catch(error) {
        return next(error);
    }

    req.session.cart = null;

    res.redirect('/orders');
}

module.exports = {
    getOrder: getOrder,
    addOrder: addOrder
}