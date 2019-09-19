const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const configKey = require('./config/keys');
//C:\Program Files\MongoDB\Server\4.0\bin

const app = express();

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//get connection string
const db = configKey.MONGO_URI;

//connect to db
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('connected to database'))
    .catch(err => console.log(err));
    mongoose.set('useFindAndModify', false);

//api routes -- failure to do declare the routes directory will give the error below -- latest express style
// throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
const userRoute = require('./routes/users');
const postRoute = require('./routes/users');

app.use(userRoute);
app.use(postRoute);

app.use('/users', userRoute);  
app.use('/posts', postRoute);

//set port to prod env port of dev port
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});