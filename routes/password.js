var express = require('express');
var router = express.Router();
const users_module = require('../models/users.js'); 
/**
 * GET route for password set.
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
    res.render('password', { title: 'Password', errorMessage: null });
  } 
  else {
    res.redirect('/');
  }
});
/**
 * POST route for handling user password creation.
 *
 * @name POST /
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/', function(req, res, next) {
  const registeredDetails = req.cookies['Credintials'];
  if (!registeredDetails)
    res.redirect('/');
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
      current = {Email, firstName, lastName}
      const emailExists = users_module.getUsers().some(user => user.Email === Email);
      if (emailExists) {    
        res.render('register', {
        title: 'Registration Error',
        errorMessage: 'This email is already in use, please choose another one.',
        user: current,
        registered: null,
        });
      }
      else{
        const newUser = { Email,firstName,lastName, Password: password_1};
        users_module.addUser(newUser);
        res.render('login', { title: 'Login', errorMessage: null, registered: "You are registered!"});
      }
    }
  }
});
module.exports = router;