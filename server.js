const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const configKey = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
//this passportSetup is availbale to any file using
const passportSetup = require('./config/passport-setup');
//C:\Program Files\MongoDB\Server\4.0\bin
//check the proxy in the client package.json -- might affect app in production mode

const app = express();

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//encrypts cookie from passport.serialize in passportSetup.js
//sends the cookie to the browser
//all this happens once a user is logged in
app.use(cookieSession({
    maxAge: 24*60*60*1000,//1 day in milliseconds
    keys: configKey.cookieKey
}));

//init passport before using cookie
app.use(passport.initialize());
//use passport.session to control login
app.use(passport.session());

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
const authRoute = require('./routes/auth');

app.use(userRoute);
app.use(authRoute);

app.use('/users', userRoute);  
app.use('/auth', authRoute);


//serve static assets if in prduction  -- gives access to the front end routes built with react
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));
    
    //for any route other than the api routes, get the index.html file in build in client folder
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
    }

//set port to prod env port of dev port
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});