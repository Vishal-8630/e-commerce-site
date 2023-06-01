const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
    constructor(email, password, fullname, street, postal, city){
        this.email = email,
        this.password = password,
        this.name = fullname,
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        }
    }

    static getUserById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({_id: uid}, { projection: {password: 0}});
    }

    async signup(){
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address 
        });
    }

    getExistingUser(){
        return db.getDb().collection('users').findOne({ email:  this.email});
    }

    async isUserAlreadyExists(){
        const result = await this.getExistingUser();
        
        if(result){
            return true;
        }

        return false;
    }

    compareUserPassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;