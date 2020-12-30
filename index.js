const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

// Use bodyparser to collect json object
app.use(bodyParser.json());

// routes
const ttlRoute = require('./TTL/route');
app.use('/', ttlRoute);

// connect to db
mongoose.connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log('DB connected');
    }
);

// Listening to the server
app.listen(process.env.PORT, () => {
    console.log('app running on port', process.env.PORT);
});
