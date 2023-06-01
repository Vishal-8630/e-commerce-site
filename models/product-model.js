const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image;
        this.updateImagepath();

        if(productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findMultiple(ids) {
        const productIds = ids.map(function(id){
            return new mongodb.ObjectId(id);
        });

        const products = await db.getDb().collection('products').find({_id: {$in: productIds}}).toArray();

        return products.map(function(product) {
            return new Product(product);
        });
    }

    static async findById(productId) {
        let pId;

        try{
            pId = new mongodb.ObjectId(productId);
        } catch(error) {
            error.code = 404;
            throw error;
        }

        const product = await db.getDb().collection('products').findOne({_id: pId});

        if(!product) {
            const error = new Error('Could not find product! ');
            error.code = 404;
            throw error;
        }

        return new Product(product);
    }

    static async fetchAll() {
        const products = await db.getDb().collection('products').find().toArray();

        return products.map(function(productDocument){
            return new Product(productDocument);
        });
    }

    updateImagepath (){
        this.imagePath = `product-data/images/${this.image}`;
        this.imageUrl =   `/products/assests/images/${this.image}`;
    }

    async save() {
        const pId = new mongodb.ObjectId(this.id);
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image 
        };

        if(this.id) {

            if(!this.image){
                delete productData.image;
            }

            await db.getDb().collection('products').updateOne({_id: pId}, {$set: productData});
        } else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    replaceImage(newImage) {
        this.image = newImage;
        this.updateImagepath();
    }

    remove() {
        const pId = new mongodb.ObjectId(this.id);

        return db.getDb().collection('products').deleteOne({_id: pId});
    }
}

module.exports = Product;