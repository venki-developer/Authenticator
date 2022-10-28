require('dotenv').config({ path: './.env' });
const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');

// specifying the passport to use google authentication

passport.use(new googleStrategy({
    clientID: process.env.cID, 
    clientSecret:process.env.Secret,
    callbackURL:process.env.CB
        
    },
    // accessing credentials from google
    function(accessToken, refreshToken, profile, done){
        User.findOne({email:profile.emails[0].value}).exec(function(err, user){
            if(err) {console.log('Error in google strategy passport',err); return;}
            console.log(profile);
            if(user) {
                // if found , set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err, user){
                    if(err){
                    console.log('Error in creating user google strategy: ',err); return;}
                    return done(null,user); 
                })
            }
        });
    }

));

module.exports = passport;
