const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    email:{type: 'string', required: true,unique: true},
    password:{type: 'string', required: true},
    name:{type: 'string', required: true},
    resetLink:{ data:'string', default:''},
    resetToken:String,
    expiresIn:Date

},{
    timestamps:true
});

userSchema.pre('save', async function(next){
    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;