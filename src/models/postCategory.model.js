const mongoose = require('mongoose');

const { Schema } = mongoose;

const postCategorySchema = new Schema({
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
});

const PostCategory = mongoose.model('PostCategory', postCategorySchema);

module.exports = PostCategory;
