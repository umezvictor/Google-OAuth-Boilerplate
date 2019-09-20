const express = require('express');
const router = express.Router();
const User = require('../model/User');
const passport = require('passport');

//calls config/passportSetup.js at runtime from server.js

//auth with Google login
//redirects to google consent screen
router.get('/google', passport.authenticate('google', {
    //the scope property tells google the info needed 
    scope: ['profile']
}));

//callback route for google to redirect to
//passport.authenticate handles the url parameter sent along from google
//the call back function in passport-setup.js uses it to interact with
//google and retrieve the user profile from google
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //below will work after passport has handled the process
    //of checking user and sserialising user, creating/encrypting cookie
    //at this point user is logged in 
    //and user is available in the req object via req.user made available in passport.deserializeUser in passportsetup.js
    //redirect to profile page route from here
});

module.exports = router;
