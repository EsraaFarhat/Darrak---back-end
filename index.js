const mongoose = require('mongoose');
const express = require('express');

const app = express();

mongoose.connect('mongodb://localhost/Darrak', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log("connected to MongoDB..."))
.catch(err => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(3000, ()=> {
    console.log(`listening on port ${port}...`);
});
