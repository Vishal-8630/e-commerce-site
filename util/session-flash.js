function getSessionData(req) {
    let sessionData = req.session.flashedData;

    if(!sessionData){
        sessionData = {
            hasError: false,
            email: '', 
            confirmEmail: '', 
            password: '', 
            fullname: '',
            street: '',
            postal: '',
            city: '',
        }
    }

    req.session.flashedData = null;
    return sessionData;
}

function flashDataToSession(req, data, action){
    req.session.flashedData = data;
    req.session.save(action);
}

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
}