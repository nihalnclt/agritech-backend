const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/databaseConfig');
const usersRouter = require('./routes/usersRouter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.send('Hello World..!');
});

app.use('/api/v1/users', usersRouter);

app.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
});
