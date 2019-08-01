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

function give_data(result) {
    match_list = result;
}

function sync(name, state, new_state, index, match_list) {
    const {Client}  = require('pg')
    const client    = new Client ({
        user: "postgres",
        password: "788a829a",
        host: "localhost",
        port: 5432,
        database: "bf_manager"
})
client.connect()
    .then(() => client.query("select * from match"))
    .then(res => give_data(res.rows))
    .then(() => client.end())
}

io.sockets.on('connection', function(socket) {
    sync();
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
        if (match_list[index].match_state === 0) {
            sql.state(match_list[index].match_name, match_list[index].match_state, 1, index)
            match_list[index].match_state = 1;
        }
        else {
            sql.state(match_list[index].match_name, match_list[index].match_state, 0, index)
            match_list[index].match_state = 0;
        }
        io.sockets.emit('sync_board', match_list);
    });
});

server.listen(8080);