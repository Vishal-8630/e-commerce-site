const Product = require('./product-model');

class Cart {
    constructor(item = [], totalQuantity = 0, totalPrice = 0) {
        this.item = item;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    async updatePrice(){
        const productIds = this.item.map(function(item) {
            return item.product.id;
        });

        const products = await Product.findMultiple(productIds);

        const deletableCartItmeProductIds = [];

        for(const cartItem of this.item) {
            const product = products.find(function(prod) {
                return prod.id === cartItem.product.id;
            });

            if(!product) {
                deletableCartItmeProductIds.push(cartItem.product.id);
                continue;
            }
        }
    }

    addItem(product) {
        const cartItem = {
            product: product,
            quantity: 1,
            totalPrice: product.price
        }

        for (let i = 0; i < this.item.length; i++) {
            let item = this.item[i];

            if (item.product.id === product.id) {
                cartItem.quantity = +item.quantity + 1;
                cartItem.totalPrice = item.totalPrice + product.price;
                this.item[i] = cartItem;

                this.totalQuantity++;
                this.totalPrice += product.price;
                return;
            }
        }
        this.item.push(cartItem);
        this.totalQuantity++;
        this.totalPrice += product.price;
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.item.length; i++) {
            let item = this.item[i];

            if (item.product.id === productId && newQuantity > 0) {
                const quantityChange = newQuantity - item.quantity;
                item.quantity = newQuantity;
                item.totalPrice = newQuantity * item.product.price;
                this.item[i] = item;

                this.totalQuantity += quantityChange;
                this.totalPrice += quantityChange * item.product.price;
                return { updatedItemPrice: item.totalPrice };
            } else if (item.product.id === productId && newQuantity <= 0) {
                this.item.splice(i, 1);

                this.totalQuantity -= item.quantity;
                this.totalPrice -= item.totalPrice;
                return { updatedItemPrice: 0 };
            }
        }
    }
}

module.exports = Cart;