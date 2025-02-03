var express = require('express');
var router = express.Router();
const users_module = require('../models/users.js'); 
/**
 * GET route for login form.
 *
 * @name GET /
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.get('/', function(req, res, next) {
    if (req.session.user)
        return res.redirect('/chat/read');
    else
        res.render('login', { title: 'Login', errorMessage: null, registered: null });
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
  var { "Email": Email, "Password": password } = req.body;
  Email = Email.trim();
  password = password.trim();
  const user = users_module.getUsers().find(user => user.Email === Email);
  if (user) {
      if (user.Password === password) {
          req.session.user = user;
          res.redirect('/chat/read');
      } 
      else
          res.render('login', { title: 'Login', errorMessage: "Wrong Password!", registered: null });
      
  } 
  else
      res.render('login', { title: 'Login', errorMessage: "No Such Registered Email!", registered: null });
});
module.exports = router;