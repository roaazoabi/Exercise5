var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

// ------------------------------- Here is the cookie timer in seconds ----------------------------------------------------------
const REGISTER = 30; 
router.use(cookieParser());

/**
 * GET route for displaying user details if stored in cookies.
 * If no cookie exists, renders a blank registration form.
 *
 * @name GET /
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
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
/**
 * POST route for handling user login.
 * Checks user input, checks for email uniqueness, and stores user details in a cookie.
 *
 * @name POST /
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/', function (req, res) {
  var { Email, "First Name": firstName, "Last Name": lastName } = req.body;
  Email = Email.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  current = {Email, firstName, lastName}
  const emailExists = global.users.some(user => user.Email === Email);
  const registeredDetails = req.cookies['Credintials'];
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