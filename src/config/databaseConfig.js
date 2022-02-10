const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { autoIndex: true }, (error) => {
    if (!error) {
        console.log('mongodb connection established successfully');
    } else {
        console.log(error);
    }
});
