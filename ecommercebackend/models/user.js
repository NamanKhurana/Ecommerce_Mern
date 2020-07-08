const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String, //it will be used to generate hashed password using uuidv1
    role: {//there will be 2 types of role : user (0 for user) and admin(1 for admin)
        type: Number,
        default: 0
    },
    history: {//purchase history
        type: Array,
        default: []
    }
},
    { timestamps: true }); //timestamps are there to have created at and updated at fields automatically


//virtual field
//this password will come from client side and then get hashed using crypto
userSchema.virtual('password')
    .set(function (password) {
        this._password = password,
            this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = { //for adding methods/functions to userSchema

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha256', this.salt) //encrypt password using crypto
                .update(password)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);