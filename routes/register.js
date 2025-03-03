var express = require('express');
var router = express.Router();
const users_module = require('../models/users.js'); 
const { use } = require('./chat.js');
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
      res.render('register', {
        title: 'Register',
        errorMessage: null,
        user: userDetails,
        registered: null,
      });
  } 
  else {
    res.render('register', { title: 'Register', errorMessage: null, user: null, registered: null });
  }
});
/**
 * POST route for handling user registration.
 * Checks user input, checks for email uniqueness, and stores user details in a cookie.
 *
 * @name POST /
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/', async function (req, res) {
  var { "Email": Email, "First Name": firstName, "Last Name": lastName } = req.body;
  Email = Email.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  current = {Email, firstName, lastName}
  const users = await users_module.getUsers();
  const emailExists = users.some(user => user.Email === Email);
  if (emailExists) {
    res.render('register', {
        title: 'Registration Error',
        errorMessage: 'This email is already in use, please choose another one.',
        user: current,
        registered: null,
    });
  } 
  else if (!firstName || !lastName){
    res.render('register', {
      title: 'Registration Error',
      errorMessage: 'Some Information are missing!',
      user: current,
      registered: null,
    });
  }
  else {
    const newUser = { Email, firstName, lastName };
    const userDataString = encodeURIComponent(JSON.stringify(newUser));
    res.cookie('Credintials', userDataString, { maxAge: req.app.locals.REGISTER * 1000, httpOnly: true });
    res.redirect('/password');
  }
});
module.exports = router;