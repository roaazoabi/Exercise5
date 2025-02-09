var express = require('express');
var router = express.Router();
const messages_model = require('../models/message.js');
const message = require('../models/message.js');
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
    res.render('chat_search', { title: 'Chat Room', user: req.session.user, messages: null});
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

router.post('/search',async function(req, res, next) {
    var {"Message": message} = req.body;
    var user = req.session.user;
    if (!user)
        res.redirect('/')
    var result = await messages_model.searchMessage(message);
    res.render('chat_search', { title: 'Chat Room', user: req.session.user, messages:result});
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
router.get('/update',  async function(req, res) {
    const lastUpdate = await messages_model.getUpdate();
    res.json({lastUpdate})
});
router.get('/fetch',  async function(req, res) {
    const messages = await messages_model.fetchAll();
    res.json({ messages });
});

module.exports = router;