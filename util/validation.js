function isEmpty(value) {
    return !value || value.trim === '';
}

function hasValidCredentails(email, password) {
    return email
        && email.includes('@')
        && password
        && password.trim().length > 3
}

function hasValidDetails(email, password, name, street, postal, city) {
    return hasValidCredentails(email, password)
        && !isEmpty(name)
        && !isEmpty(street)
        && !isEmpty(postal)
        && !isEmpty(city);
}

function compareEmail(email, confirmEmail){
    return email === confirmEmail;
}

module.exports = {
    hasValidDetails: hasValidDetails,
    compareEmail: compareEmail
}