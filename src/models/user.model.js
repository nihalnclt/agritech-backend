const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        index: { unique: true },
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
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],
        default: 'admin',
    },
    token: {
        type: String,
    },
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.token;

    return userObj;
};

// generating jsonwebtoken
userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() }, 'secret', {
            expiresIn: '7d',
        });

        user.token = token;
        await user.save();

        return token;
    } catch (err) {
        throw new Error(err?.message);
    }
};

// hashing password by using bcryptjs
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
