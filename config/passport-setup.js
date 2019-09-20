const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const User = require('../model/User');

//create a cookie for the user and send it to the browser
//for accessing protected routes later
//cookie will be retrieved from the server and the user id
//decoded and ussed to auth user and display resource requested


passport.serializeUser((user, done) => {
    //use the user id as the identifier
    //it adds to user id received from the callback below into the cookie
    done(null, user.id);
});

//when the cookie comes back - if   user comes back
//check who the id belongs to
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);//pass the user to the next stage
        //what this does is to attach the user to the request object
        //
    });    
});

//using google strategy
passport.use(
    new GoogleStrategy({
    //options for google strategy -- use google + api to authenticate people via google
    callbackURL: '/auth/google/redirect',
    clientID: keys.clientID,
    clientSecret: keys.clientSecret
}, (profile, done) => {
    //passport callback function
    //profile is the info returned from google
    //save the data to my own database, or look up if saved before and login
    //check if user already exists, or creates one if not
    User.findOne({googleId: profile.id}).then(user => {
        if(user){
            done(null, user);
            //return res.status(400).json({msg: "User already exists"});
        }else{
             //create new user object
    new User({
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: "abc@gmail.com",
        phone: 8277373737,
        password: "mypassword",
        googleId: profile.id 
    }).save().then((newUser) => {
        done(null, newUser);
    })
        }
    });   
})
)

/**how done works
 * when done is called in the passport.use calback function
 * it contains the user in both instances
 * after it is called, it switches to the serialiseuser method with
 * the user data in it -- magic
 */

/*how this works
the GoogleStrategy is attached to the passport Object in passport.use
i.e the 'passport'

the object is imported in auth.js
and it's got the googleStrategy associated with it
so when 'google' is used in passport.authenticate, it knows to 
activate the GoogleStrategy -- get it
*/
