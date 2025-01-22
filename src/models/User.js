const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {Schema} = mongoose;

const UserSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    lastName :  {
        type: String,
        maxLength: 30
    },
    emailId : {
        type: String,
        required : true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 1,
        maxLength: 50,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Invalid Email Id");
            }
        }
    },
    password : {
        type: String,
        required : true,
        validate(value){
            if (!validator.isStrongPassword(value)){
                throw new Error("Weak Password\nminLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 is required");
            }
        }
    },
    age : {
        type : Number,
        min : 18,
        max : 100
    },
    photoUrl : {
        type : String,
        default : "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg",
        validate(value){
            if (!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    skills : {
        type: [String],
        validate(value){
            if (value.length>30){
                throw new Error("Skills more than 30 not allowed");
            }
        }
    },
    gender : {
        type: String,
        validate(value){
            if (!["male","female", "other"].includes(value)){
                throw new Error("Invalid Gender");
            }
        }  
    },
    about : {
        type: String,
        default: "This is the default about",
    }
}, 
{
    timestamps:true
});

UserSchema.methods.getToken = async function(){
    const user = this;

    var token = await jwt.sign({ _id: user._id }, 'Secret', { expiresIn: '1h' });
    return token;
}

UserSchema.methods.validatePassword = async function(passwordInputByUser){
    const passwordHash = this.password;

    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isValidPassword
}


const User = mongoose.model("User" , UserSchema);
module.exports = {User};