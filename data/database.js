const mongodb = require('mongodb');

const MongodbClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongodbClient.connect('mongodb://localhost:27017');

    database = client.db('online-shop');
}

function getDb() {
    if(!database){
        throw new Error('First connect to database!');
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}