const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
