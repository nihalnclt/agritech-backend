const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: { unique: true },
    },
    icon: {
        type: String,
        trim: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
