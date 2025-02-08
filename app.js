var createError = require('http-errors');
var express = require('express');
var path = require('path');
// ------------------------------- Here is the pollin interval in seconds ----------------------------------------------------------
const POLLING_INTERVAL = 10
// ------------------------------- Here is the session timer in seconds ----------------------------------------------------------
const SESSION_TIMEOUT = 10 *60
var cookieParser = require('cookie-parser');

var session = require('express-session');

var logger = require('morgan');

var register = require('./routes/register');
var login = require('./routes/login');
var password = require('./routes/password');
var chat = require('./routes/chat');

var app = express();
app.locals.POLLING_INTERVAL = POLLING_INTERVAL;
app.use(express.json());
app.use(session({
  secret: 'roaa123',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: SESSION_TIMEOUT * 1000,
  }
}));
var cookieParser = require('cookie-parser');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use('/', login);
app.use('/register', register);
app.use('/password', password);
app.use('/chat', chat);

app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;