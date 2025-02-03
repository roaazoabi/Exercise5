var express = require('express');
var router = express.Router();
const messages_model = require('../models/message.js');const Message = require('../models/message.js');
const message = require('../models/message.js');
 ;
router.get('/send', function(req, res) {
    if (!req.session.user)
        return res.redirect('/');
    res.render('chat_send', { title: 'Chat Room', user: req.session.user });
});
router.get('/read', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('chat_read', { title: 'Chat Room', user: req.session.user, messages: messages_model.fetchAll() });
});
router.get('/search', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('chat_search', { title: 'Chat Room', user: req.session.user, messages: null });
});
router.get('/logout', function(req, res) {
    req.session.destroy(() => {
            res.redirect('/');
    });
});
router.post('/send', function(req, res, next) {
    var {"Message": message} = req.body;
    var user = req.session.user;
    if (user)
        messages_model.addMessage(message, user);
    });
router.post('/search', function(req, res, next) {
    var {"Message": message} = req.body;
    var user = req.session.user;
    if (user)
        res.render('chat_search', { title: 'Chat Room', user: req.session.user, messages: messages_model.searchMessage(message)});
    });
module.exports = router;