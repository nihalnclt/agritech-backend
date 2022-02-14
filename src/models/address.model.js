const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['india'],
    },
    streetAddress: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        lowercase: true,
        enum: [
            'andhra pradesh',
            'arunachal pradesh',
            'assam',
            'bihar',
            'chhattisgarh',
            'goa',
            'gujarat',
            'haryana',
            'himachal pradesh',
            'jammu and kashmir',
            'jharkhand',
            'karnataka',
            'kerala',
            'madhya pradesh',
            'maharashtra',
            'manipur',
            'meghalaya',
            'mizoram',
            'nagaland',
            'odisha',
            'punjab',
            'rajasthan',
            'sikkim',
            'tamil nadu',
            'telangana',
            'tripura',
            'uttarakhand',
            'uttar pradesh',
            'west bengal',
            'andaman and nicobar islands',
            'chandigarh',
            'dadra and nagar haveli',
            'daman and diu',
            'delhi',
            'lakshadweep',
            'puducherry',
        ],
    },
    pincode: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        validate(value) {
            const regx =
                /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/;
            if (!regx.test(value)) {
                throw new Error('Invalid phone number');
            }
        },
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email Address');
            }
        },
    },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
