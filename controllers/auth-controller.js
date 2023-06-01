
// This is for database handling of the user input 
const User = require('../models/user-model');

// This is for controlling user sessions i.e. creation or deletion of user sessions
const authUtil = require('../util/authentication');

// This for checking user data validation while making account or logging in to account
const userDetailValidation = require('../util/validation');

// This is for adding data to sessions 
const sessionFlash = require('../util/session-flash');


// This is for serving signup page for signup get route 
function getSignup(req, res) {
    const sessionData = sessionFlash.getSessionData(req);

    res.render('customer/auth/signup', { inputData: sessionData });
}

// This is for taking user signup input for signup post route
async function signup(req, res, next) {
    // Extracting the data from the request
    const data = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city
    }

    // Checking for the invalid credentials
    if (!userDetailValidation.hasValidDetails(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    ) || !userDetailValidation.compareEmail(
        req.body.email,
        req.body['confirm-email']
    )
    ) {
        // Adding data to session
        sessionFlash.flashDataToSession(req, {
            hasError: true,
            errorMessage: 'Invalid Credentials - Check them carefully!',
            ...data
        },
            function () {
                res.redirect('/signup');
            });
        return;
    }

    // Making user object
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    );

    try {

        // Checking for user existance in the database
        const isUserExists = await user.isUserAlreadyExists();

        if (isUserExists) {
            sessionFlash.flashDataToSession(req, {
                hasError: true, 
                errorMessage: 'User already exists - Try logging in instead!',
                ...data
            },
                function () {
                    res.redirect('/signup');
                })
            return;
        }

        // Saving the user to the database
        await user.signup();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/login');
}

// This is for serving login page for login get route
function getLogin(req, res) {
    const sessionData = sessionFlash.getSessionData(req);

    res.render('customer/auth/login', { inputData: sessionData });
}

// This is for taking user login input for login post route
async function login(req, res) {
    // Making user object
    const user = new User(req.body.email, req.body.password);
    let existingUser;

    try {
        existingUser = await user.getExistingUser();
    } catch (error) {
        next(error);
        return;
    }

    const sessionErrorData = {
        email: user.email,
        password: user.password
    }

    // Checking for user existance in the database
    if (!existingUser) {
        sessionFlash.flashDataToSession(req, {
            hasError: true,
            errorMessage: 'User doesn\'t exists - Create a account',
            ...sessionErrorData
        },
            function () {
                res.redirect('/login');
            });
        return;
    }

    // Checking for the password
    const isCorrectPasswrod = await user.compareUserPassword(existingUser.password);

    if (!isCorrectPasswrod) {
        sessionFlash.flashDataToSession(req, {
            hasError: true,
            errorMessage: 'Incorrect password - Check the password again',
            ...sessionErrorData
        },
            function () {
                res.redirect('/login');
            });
        return;
    }

    // Giving autherasization and adding data to session
    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

// This is for logout route
function logout(req, res) {
    authUtil.destroyUserAuthSession(req, res);
    res.redirect('/');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
};