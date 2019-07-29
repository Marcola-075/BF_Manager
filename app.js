var express     = require('express');
var http        = require('http');
var ent         = require('ent');
var sql = require("./sql.js");

var app = express();
var server      = http.createServer(app);

var io    = require('socket.io').listen(server);

var match_list    = [];
var index = 0;           

app.use (express.static('views'))

.get('/BF_manager', function(req, res)
{
    res.render('BF_manager.ejs');
})

.use(function(req, res, next)
{
    res.redirect('/BF_manager');
});

io.sockets.on('connection', function(socket) {
    socket.emit('sync_board', match_list);
    socket.on('add_match', function(match){
        match = ent.encode(match);
        match_list.push({match_name: match, match_state: 1});
        index = match_list.length -1;
        sql.add(match, index);
        socket.broadcast.emit('add_match', {match:match, index:index});
        io.sockets.emit('sync_board', match_list);
    });

    socket.on('rm_match', function(index){
        sql.rm(index, match_list[index].match_name, match_list[index].match_state)
        match_list.splice(index, 1);
        io.sockets.emit('sync_board', match_list);
    });

    socket.on('new_state', function(index){
        var name = match_list[index].match_name;
        name = ent.encode(name);
        if (match_list[index].match_state === 0) {
            match_list[index].match_state = 1;
            sql.match_state(match_list[index].match_name, match_list[index].match_state, 1, index)
        }
        else {
            match_list[index].match_state = 0;
            sql.match_state(match_list[index].match_name, match_list[index].match_state, 0, index)
        }
        io.sockets.emit('sync_board', match_list);
    });
});

server.listen(8080);