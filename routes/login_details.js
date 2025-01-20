var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
const REGISTER = 30; 
router.use(cookieParser());
router.get('/', function(req, res, next) {
  const registeredDetails = req.cookies['Credintials'];

  if (registeredDetails) {
    try {
      const decodedData = decodeURIComponent(registeredDetails);
      const userDetails = JSON.parse(decodedData);
      console.log(userDetails)
      res.render('details', {
        title: 'Register',
        errorMessage: null,
        ...userDetails 
      });
    } catch (error) {
      res.render('details', { title: 'Register', errorMessage: null });
    }
  } else {
    res.render('details', { title: 'Register', errorMessage: null });
  }
});
router.post('/', function (req, res) {
  const { Email, "First Name": firstName, "Last Name": lastName } = req.body;
  const emailExists = global.users.some(user => user.Email === Email);
  if (emailExists) {
    res.render('details', {
        title: 'Registration Error',
        errorMessage: 'This email is already in use, please choose another one.',
    });
  } 
  else {
    const newUser = { Email, firstName, lastName };
    global.users.push(newUser);
    const userDataString = encodeURIComponent(JSON.stringify(newUser));
    res.cookie('Credintials', userDataString, { maxAge: REGISTER * 1000, httpOnly: true });
    res.render('password', { title: 'Password' });
  }
});
module.exports = router;