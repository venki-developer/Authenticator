require('dotenv').config({ path: './.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
// adding body parser 
const bodyParser = require('body-parser');
// const cors = require('cors');
// Port Number information
const port = process.env.PORT ;
// for sending emails
const nodemailer = require('nodemailer');
// Express ejs layouts
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
// Connecting to the DB
const db = require('./config/mongoose');
const session = require('express-session');
// passport strategy
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
app.use(express.json());
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Node Sass Middleware usage block
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('./assets'));
// Setting up view engine
app.set('view engine','ejs');
app.set('views', './views');
app.use(expressLayouts);
// extract styles and scripts from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use(session({
    name:'codial',
    // TODO change the secret before deployment in production 
    secret: 'blahsomething',
    saveUninitialized:false,  //Whenever there is a request that the session is not iniatilized i.e user is not logged in i.e identity is not established
    resave: false, //Identity is established and we don't need to rewrite the chnages
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create(
        {
            mongoUrl: process.env.DATABASE ,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
        
}));
// passport configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// use routes
app.use('/', require('./routes/index'));
// Server listening status
app.listen(port, function(err){
    if(err){
        // console.log('Errors', err);
        // interpolation of above statement
        console.log(`Error in running the server : ${err}`);
    }else{
        console.log(`Server is running on the port : ${port}`);
    }
});