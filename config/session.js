const session = require('express-session');
const mongoDbstore = require('connect-mongodb-session');

function createSessionStore(){
    const mongoDbStore = mongoDbstore(session);

    const store = new mongoDbStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return store;
}

function createSessionConfig(){
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 60 * 60 * 60 * 1000
        }
    };
}

module.exports = createSessionConfig;