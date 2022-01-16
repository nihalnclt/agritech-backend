const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    icon: {
        type: String,
        trim: true,
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
