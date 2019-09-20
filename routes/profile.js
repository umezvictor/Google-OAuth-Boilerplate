


// const authCheck = (req, res, next) => {
//     //check if user is not logged in
//     if(!req.user){
//         //this is the req.user made avalable by passport after authing user
//         //oga login jare
//         //redirect to login page
//     }else{
//         //if logged in call next middleware of function, 
//         //'next' is the route below,i.e next function
//         next();
//     }
// }

// //authCheck ensures user is logged in to view resource
// router.get('/proflepage', authCheck, (req, res) => {
//     res.send('logged as ' + req.user.firstname);
// });