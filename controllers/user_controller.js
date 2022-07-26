require('dotenv').config({ path: './.env' });
const User = require('../models/user');
const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

// const jwt = require('jsonwebtoken');
const { update } = require('../models/user');
// const generatePassword = (
//     length = 20,
//     wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
//   ) =>
//     Array.from(crypto.randomFillSync(new Uint32Array(length)))
//       .map((x) => wishlist[x % wishlist.length])
//       .join('')
  
//   console.log(generatePassword());
                
let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

module.exports.signup = function (req, res) {

    return res.render('user_sign_up', {
        title: 'Authenticator'
    })
}

module.exports.signIn = function (req, res){
    return res.render('user_sign_in', {
        title: 'Authenticator|Sign In'
    })
}

module.exports.create = async function (req, res) {
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user){
            if(req.body.password == req.body.confirm_password){
                let userdata = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password
                });
                await userdata.save();
                var mailOptions ={
                    from: process.env.MAIL_USER,
                    to: userdata.email,
                    subject:'Thanks for Signing Up',
                    text:"Your account has been created successfully"
                }

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                });
                req.flash('success','Account created successfully');
                return res.redirect('/users/sign-in');
                return res.status(200).json({
                    data:{
                        user:user
                    },
                    message:"user created successfully"
        
                })
            }
        }else{
            req.flash('error', 'User already exists');
            return res.redirect('/users/sign-in');

        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: err
        })

    }
   
}


module.exports.createSession = function (req, res) {
    req.flash('success',"Logged in successfully");
    return res.redirect('/users/profile');
}

module.exports.profile = function (req, res) {
    return res.render('profile', {
        title: 'Profile'
    })

}

module.exports.destroySession = function(req, res){
    req.logout(function(err){
       if(err){
            console.log(err);
        }
        console.log('log out successfull')
        req.flash('success',"Logged out successfully");
        return res.redirect('/');
    });
     
    
}

module.exports.forgotForm = function (req, res) {
    return res.render('forgot_password',{
        title:'Authenticator | forgot password'
    });
}

module.exports.sendPassword = function (req, res) {



        crypto.randomBytes(32, function (err, data) {
            if (err) {
                console.log(err);
            }
            const token = data.toString('hex');
            User.findOne({email:req.body.email}, function (err, user) {
                if (err) {
                    console.log(err);
                }
                if (!user) {
                    return res.status(422).json({message: 'User does not exist'});
                }
                user.resetToken = token;
                user.expiresIn = Date.now()+1200000;
                user.save().then((result)=> {
                    var mailOptions ={
                        from: process.env.MAIL_USER,
                        to: user.email,
                        subject:'Forgot password Request from AuthoX',
                        html:`Please <a href="http://localhost:8000/users/reset/${user._id}/${token}">click</a> here to reset the password`
                    }
        
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                    });
                    req.flash('success','Your password reset link has been sent to your mail!');
                    return res.redirect('back');
                });

            })

        })

    // try{
        // let user = await User.findOne({ email: req.body.email });
        // let newUser = user;
        // newUser.password=user.password;
        //         User.findOneAndUpdate(user.email,newUser,function(err,UpdatedUser){
        //             if(err){
        //                 console.log(`Error in updating the user:${err}`);
        //                 return;
        //             }
        //         })
           
        // const {email}=req.body;
        // User.findOne({email:email},function(err,user){
        //     if(err || !user){

        //         return res.status(400).json({error:"User with the above mail id does not exists"});
        //     }

        //     const token = jwt.sign({_id:user._id}, process.env.RESET_PASSWORD_KEY,{expiresIn:'20m'})
        // })
           
           
        
    // }catch(err){
    //     console.log(err);
    //     return res.status(500).json({
    //         error: err
    //     })
    // }
}

module.exports.resetPasswordform = function (req, res) {
    return res.render('reset_password_form',{
        title:'Authenticator | Reset Link'
    })
}

module.exports.resetPasswordUpdated = function (req, res) {
    let newPassword = req.body.password;
    let userId = req.params.id;
    let userToken = req.params.token;
    console.log(userId);
    console.log(userToken);
    console.log(req.body.password);
    User.findById(req.params.id, function(err,user){
        let parsedDate = new Date();
        let CurrentDate =parsedDate;
        let tokenDate = user.expiresIn;
            console.log(CurrentDate);
        let arr=[CurrentDate,tokenDate].sort();
        console.log(arr);
        if(err){
            console.log('Error is resetting the password');
            return;
        }
        if(!user){
            console.log('User does not exist');
            req.flash('error','User does not exist');
            return res.redirect('users/sign-up');
            return;
        }

        if(user.resetToken != req.params.token){
            console.log('User reset token is invalid');
            req.flash('error','Your Password reset link is invalid');
            return res.redirect('http://localhost:8000/users/forgot-password');
            return;
        }
        if(arr[0]==tokenDate){
            console.log('Token expired');
            req.flash('error','Your Password reset link expired');
            return res.redirect('http://localhost:8000/users/forgot-password');
            return;
          }
          if(req.body.password!=req.body.confirmPassword){
            console.log('Password Mismatch');
            req.flash('error','Password Mismatch');
            return res.redirect('back');
            return;

          }

          let newPassword = bcrypt.hashSync(req.body.password,10);
        //   console.log(req.body.password);
        //   console.log(newPassword);
          let newUser = user;
          newUser.password = newPassword;
          newUser.resetToken= "";
          newUser.expiresIn="";
          User.findByIdAndUpdate(req.params.id,newUser,function(err,UpdatedUser){
            if(err){
                console.log(`Error in updating the user:${err}`);
                return;
            }
            req.flash('success','Password Reset Successfull');
            return res.redirect('http://localhost:8000/users/sign-in');
        })
          
    })
    

}

module.exports.updatePasswordForm = function(req,res){
    return res.render('update_password',{
        title:'Authenticator | update'
    })
}


module.exports.updatePassword =  (req,res)=>{
    if(req.body.password!=req.body.confirmPassword){
        req.flash('error','Passwords don\'t  match');
        return res.redirect('back');
    }

    User.findById(req.params.id,function(err,user){
    
        if(err){
            console.log(`Error in finding user :${err}`);
            return;
        }
        // let newUser = user;
        newPassword = bcrypt.hashSync(req.body.password,10);
        // newUser.password=newPassword;
        User.findByIdAndUpdate(req.params.id,{password:newPassword},function(err,UpdatedUser){
            if(err){
                console.log(`Error in updating the user:${err}`);
                return;
            }
            req.flash('success','Password Updated');
            return res.redirect('/users/profile');
        })
    })

 
}