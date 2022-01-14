const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email Address');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        validate(value) {
            const passwordRegx = /(?=.*\d)(?=.*[a-z]).{5,}/;
            if (!passwordRegx.test(value)) {
                throw new Error(
                    'Must contain at least one number and one lowercase letter, and at least 5 or more characters'
                );
            }
        },
    },
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
