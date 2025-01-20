var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next) {
  const registeredDetails = req.cookies['Credintials'];
  if (registeredDetails) {
    res.render('password', { title: 'Password', errorMessage: null });
  } 
  else {
    res.redirect('/')
  }
});

router.post('/', function(req, res, next) {
  const registeredDetails = req.cookies['Credintials'];
  if (!registeredDetails)
    res.render('details', { title: 'Register', errorMessage: null , user: null, registered: null});
  else {
    const { password_1, password_2 } = req.body;
    if (password_1 !== password_2) {
      res.render('password', {
        title: 'Registration Error',
        errorMessage: 'Passwords do not match - Try Again!',
      });
    } 
    else {
      const decodedData = decodeURIComponent(registeredDetails);
      const userDetails = JSON.parse(decodedData);
      var firstName = userDetails['firstName']
      var lastName = userDetails['lastName']
      var Email = userDetails['Email']
      const newUser = { Email,firstName,lastName, password: password_1};
      // Add to DB
      global.users.push(newUser);
      console.log(global.users);
      res.clearCookie('Credintials');
      res.render('details', { title: 'Register', errorMessage: null , user: null, registered: "You are registered!"});
    }
  }
});

module.exports = router;