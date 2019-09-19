const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSignupInput(data) {
    //data refers to req.body in the api method in routes
    //empty errors object to hold errors
    let errors = {};

    //init fields
    data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
    data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    
    //this errors object etc will be used in the frontend to show error messages
    //validate firstname
    if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
        errors.firstname = 'First name must be between 2 and 30 characters';
      }
    
      if (Validator.isEmpty(data.firstname)) {
        errors.firstname = 'First name field is required';
      }

      //validate lastname
      if (!Validator.isLength(data.lastname, { min: 2, max: 30 })) {
        errors.lastname = 'Last name must be between 2 and 30 characters';
      }
    
      if (Validator.isEmpty(data.lastname)) {
        errors.lastname = 'Last name field is required';
      }
    
      //validate email
      if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
      }
    
      if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
      }

      //validate phone number
      if(Validator.isEmpty(data.phone)){
        errors.phone = 'Phone number is required';
      }

      if(!Validator.isNumeric(data.phone)){
        errors.phone = 'Only digits are allowed'
      }
      //validate password
      if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
      }
    
      if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters';
      }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

