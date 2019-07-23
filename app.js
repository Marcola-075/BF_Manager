var express     = require('express');
var http        = require('http');
var ent         = require('ent');

var app = express();
var server      = http.createServer(app);

var io    = require('socket.io').listen(server);

var match_list    = [];
var index;           

app.use (express.static('views'))

.get('/BF_manager', function(req, res)
{
    res.render('BF_manager.ejs');
})

.use(function(req, res, next)
{
    res.redirect('/BF_manager');
});

io.sockets.on('connection', function(socket){
    socket.emit('sync_board', match_list);
    socket.on('add_match', function(match){
        match = ent.encode(match);
        match_list.push({content: match, state: false});
        index = match_list.length -1;
        socket.broadcast.emit('add_match', {match:match, index:index});
        io.sockets.emit('sync_board', match_list);
    });

    socket.on('rm_match', function(index){
        match_list.splice(index, 1);
        io.sockets.emit('sync_board', match_list);
    });

    socket.on('new_state', function(index){
        var name = match_list[index].content;
        name = ent.encode(name);
        if (match_list[index].state === true)
            match_list[index].state = false;
        else
            match_list[index].state = true;
        io.sockets.emit('sync_board', match_list);
    });
});

server.listen(8080);