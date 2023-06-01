// In-built packages
const path = require('path');

// Installed Packages
const express = require('express');
const csrf = require('csurf');
const session = require('express-session');


// Database section
const db = require('./data/database');

// Routes require section
const authRoutes = require('./routes/auth-routes');
const productRoutes = require('./routes/all-products');
const baseRoutes = require('./routes/base-routes');
const adminRoutes = require('./routes/admin-routes');
const cartRoutes = require('./routes/cart-routes');
const orderRoutes = require('./routes/order-routes');

// Middleware section
const addCsrfMiddleware = require('./middlewares/csrf-middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');

// Other configuration section
const createSessionConfig = require('./config/session');

// App body
const app = express();

// EJS engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static file and encoder section
app.use(express.static('public'));
app.use('/products/assests', express.static('product-data'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Session section
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));

// Initializing cart for the request
app.use(cartMiddleware);

// Authentication section
app.use(checkAuthMiddleware);

// CSRF security section
app.use(csrf());
app.use(addCsrfMiddleware);

// Route implement section
app.use(authRoutes);
app.use(productRoutes);
app.use(baseRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutesMiddleware);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Error section
app.use(errorHandlerMiddleware);


// Database connectio and listen section
db.connectToDatabase()
    .then(function () {
        app.listen(3000);
    })
    .catch(function () {
        console.log('Failed to connect to database');
        console.log(error);
    });