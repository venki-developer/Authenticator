const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authenticate using passport.js

passport.use(new LocalStrategy({

    usernameField:'email',
    passReqToCallback:true
},(req,email,password,done)=>{
    
    User.findOne({ email:email }, (err, user) => {
        if(err){
            console.log('Error in finding user -->Passport');
            return done(err);
        }
        if(!user || user.password != password){

            console.log('Invalid username/password');
            return done(null,false);
        }
        return done(null, user);
    })
}))

// serialzing the user to decide  which key is to be kept in the cookie

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){

            console.log('Error in deserializing user -->Passportjs');
            return done(err);
        }
        return done(null,user);
    });
});


// check authentication
passport.checkAuthentication = function(req, res, next){
    // if the user is authorized to login, then pass the request to next controllers
    if(req.isAuthenticated()){
        return next();
    }
   
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res,next) {

    if(req.isAuthenticated()) {

        res.locals.user = req.user;
    }

    return next();
}

module.exports = passport;