var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.use(session({secret: 'itsasecret'}))
.use(express.static('public'))

var create_if_empty = function(req, res, next){
    if (typeof(req.session.match_list) == 'undefined') {
        req.session.match_list = [];
    }
    next();
}

var show_list = function(req, res) { 
    res.render('bf_manager.ejs', {match_list: req.session.match_list});
}

var add_item = function(req, res) {
    if (req.body.new_match != '') {
        req.session.match_list.push({
            content : req.body.new_match,
            state : false
        });
    }
    res.redirect('/bf_manager');
}

var rm_item = function(req, res) {
    if (req.params.id != '') {
        req.session.match_list.splice(req.params.id, 1);
    }
    res.redirect('/bf_manager');
}

var chk_state = function(req, res) {
    if (req.params.id != '') {
        let id = req.session.match_list.splice(req.params.id, 1);
        if (id[0].state === false)
            id[0].state = true;
        else
            id[0].state = false;
        req.session.match_list.push(id[0]);
    }
    res.redirect('/bf_manager/');
}

app.use(create_if_empty);
app.get('/bf_manager', show_list);
app.post('/bf_manager/add/', urlencodedParser, add_item);
app.get('/bf_manager/rm/:id', rm_item);
app.get('/bf_manager/state/:id', chk_state);

app.use(function(req, res, next){
    res.redirect('/bf_manager');
})

.listen(8080);