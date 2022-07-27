const User = require('../models/user');
// For Fetching the home page
module.exports.home = function (req, res) {

    return res.render('home', {
        title: 'Authenticator'
    })
}
