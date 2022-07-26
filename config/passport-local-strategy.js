const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

const bcrypt = require('bcryptjs');

// authenticate using passport.js

passport.use(new LocalStrategy({

    usernameField:'email',
    passReqToCallback:true
},async (req,email,password,done)=>{
    
    try{
        let user = await User.findOne({ email:email });
        console.log(password);
        console.log(user.password);
        const isMatch =await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if(isMatch){
            return done(null, user);
        }
        if(!user || user.password != password){

            req.flash('error','Invalid username or password');
            console.log('Invalid username/password');
            return done(null,false);
        }
    }catch{
        console.log('Error in finding user -->Passport');
        return done(err);
    }
        
    
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