var express = require('express');
var router = express.Router();
const messages_model = require('../models/message.js');
router.get('/send', function(req, res) {
    if (!req.session.user)
        return res.redirect('/');
    res.render('chat_send', { title: 'Chat Room', user: req.session.user });
});
router.get('/read', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('chat_read', { title: 'Chat Room', user: req.session.user, messages: [], pollingInterval: req.app.locals.POLLING_INTERVAL});
});
router.get('/search', function(req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('chat_search', { title: 'Chat Room', user: req.session.user, messages: null, pollingInterval: req.app.locals.POLLING_INTERVAL});
});
router.get('/logout', function(req, res) {
    req.session.destroy(() => {
            res.redirect('/');
    });
});

router.post('/send', function(req, res, next) {
    var {"Message": message} = req.body;
    var user = req.session.user;
    if (!user)
        res.redirect('/')
    messages_model.addMessage(message, user);
});

router.post('/search', function(req, res, next) {
    var {"Message": message} = req.body;
    var user = req.session.user;
    if (!user)
        res.redirect('/')
    res.render('chat_search', { title: 'Chat Room', user: req.session.user, messages: messages_model.searchMessage(message), pollingInterval: req.app.locals.POLLING_INTERVAL});
});

router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { new_content } = req.body;
    const user = req.session.user;
    if (!user)
        res.redirect('/')
    messages_model.editMessage(id, new_content, user);    
});

router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const user = req.session.user;
    if (!user)
        res.redirect('/')
    messages_model.deleteMessage(id, user);
});

router.get('/fetch', function(req, res) {
    const messages = messages_model.fetchAll();
    res.json({ messages });
});

module.exports = router;