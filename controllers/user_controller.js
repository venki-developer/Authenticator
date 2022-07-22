const User = require('../models/user');


module.exports.home = function (req, res) {

    return res.render('user_sign_up', {
        title: 'Authenticator'
    })
}

module.exports.signIn = function (req, res){
    return res.render('user_sign_in', {
        title: 'Authenticator|Sign In'
    })
}

module.exports.create = function (req, res) {

   User.findOne({email: req.body.email},function(err, user) {
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('Error is finding user ');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
            
        }else{
            return res.redirect('back');
        }
        
   })
}