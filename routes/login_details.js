var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
// ------------------------------- Here is the cookie timer in seconds ----------------------------------------------------------
const REGISTER = 30; 
router.use(cookieParser());
router.get('/', function(req, res, next) {
  const registeredDetails = req.cookies['Credintials'];

  if (registeredDetails) {
      const decodedData = decodeURIComponent(registeredDetails);
      const userDetails = JSON.parse(decodedData);
      res.render('details', {
        title: 'Register',
        errorMessage: null,
        user: userDetails,
        registered: null,
      });
  } 
  else {
    res.render('details', { title: 'Register', errorMessage: null, user: null, registered: null });
  }
});
router.post('/', function (req, res) {
  var { Email, "First Name": firstName, "Last Name": lastName } = req.body;
  Email = Email.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  const emailExists = global.users.some(user => user.Email === Email);
  current = {Email, firstName, lastName}
  if (emailExists) {
    res.render('details', {
        title: 'Registration Error',
        errorMessage: 'This email is already in use, please choose another one.',
        user: current,
        registered: null,
    });
  } 
  else if (!firstName || !lastName){
    res.render('details', {
      title: 'Registration Error',
      errorMessage: 'Some Information are missing!',
      user: current,
      registered: null,
    });
  }
  else {
    const newUser = { Email, firstName, lastName };
    const userDataString = encodeURIComponent(JSON.stringify(newUser));
    res.cookie('Credintials', userDataString, { maxAge: REGISTER * 1000, httpOnly: true });
    res.redirect('/password');
  }
});
module.exports = router;