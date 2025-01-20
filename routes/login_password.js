var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', function(req, res, next) {
  const registeredDetails = req.cookies['REGISTER'];
  if (registeredDetails) {
    res.render('password', { title: 'Password', errorMessage: null, registeredDetails });
  } else {
    res.render('password', { title: 'Password', errorMessage: null });
  }
});

router.post('/', function(req, res, next) {
  const { password_1, password_2 } = req.body;

  if (password_1 !== password_2) {
    res.render('password', {
      title: 'Registration Error',
      errorMessage: 'Passwords do not match!',
    });
  } 
  else {
    res.clearCookie('REGISTER');
    res.send('Password successfully set!');
  }
});

module.exports = router;