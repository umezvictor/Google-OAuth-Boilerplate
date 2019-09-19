const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const validateSignupInput = require('../validation/signup');

router.post('/signup', (req, res) => {

    // //pass in the req.body as an argument to the validesignupInput function
    const {errors, isValid} = validateSignupInput(req.body);

    //check if req.body is not valiid
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        //check if user already exists
            if(user){
                errors.email = 'User already exists';
                return res.status(400).json(errors);
            }else{
                //create new user object
                const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: req.body.password
                });
 
                //encrypt password 
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newUser.password, salt);

                //assign password to hash
                newUser.password = hash;
                
                //save user
                newUser.save(function(err, user){
                    if(err){return res.status(400).json({msg: "Record not saved"});}

                    //send activation email
                     //create token
                        var jsontoken = jwt.sign({payload: user._id}, keys.JWT_SECRET, {expiresIn: '1h'});

                        //transporter
                        const transporter = nodemailer.createTransport(sendGridTransport({
                            auth: {
                                api_key: keys.SengridApiKey
                            }
                        }));

                        //mail options
                        const mailOptions = {
                            to: user.email,
                            from: "umezvictor123@gmail.com",
                            subject: "Confirm your email",
                            html: `Click here to activate your account: http://localhost:5000/confirmation/${jsontoken}`
                        }; 

                        //send mail
                        transporter.sendMail(mailOptions, function(err){
                            if(err){
                                return res.status(400).json({msg: "Mail not sent"});
                            }else{
                                return res.status(200).json({msg: "Mail sent"});
                            }
                        });
                    //end of email sending
                });
            }
        })
        .catch(err => console.log(err));
});


//route to activate account-- updates the 'confirmed' field to true
router.put('/confirmation/:token', (req, res) => {
    //retrieve token from url
    const token = req.params.token;
    //console.log(token);
    const decodedToken = jwt_decode(token);
    //payload is an field in the token -- console.log(decodedToken) to see it 
    userId = decodedToken.payload;
    
    //Activate profile
    User.findByIdAndUpdate(userId, { $set: { confirmed: true }}, {new: true}, function(err){
        if(err){
            return res.status(400).json({msg: "Update failed"});
        }else{
            return res.status(200).json({msg: "Update Succeeded"});
        }
    });
    
});



module.exports = router;
