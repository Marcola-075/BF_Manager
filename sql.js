exports.add = async function(name, index) {
    
    const {Client}  = require('pg')
    const client    = new Client ({
        user: "postgres",
        password: "788a829a",
        host: "localhost",
        port: 5432,
        database: "bf_manager"
})
client.connect()
    .then(() => client.query("insert into match(match_name, match_state, match_index) values ($1, $2, $3)", [name, 1, index]))
    .then(() => client.end())
}

exports.rm = async function(index, name, state) {
    
    const {Client}  = require('pg')
    const client    = new Client ({
        user: "postgres",
        password: "788a829a",
        host: "localhost",
        port: 5432,
        database: "bf_manager"
})
client.connect()
    .then(() => client.query("DELETE FROM match WHERE ctid IN(SELECT ctid FROM match WHERE match_name = ($1) AND match_state = ($2) LIMIT 1)", [name, state]))
    .then(() => client.end())
}

exports.state = function(name, state, new_state, index) {
    const {Client}  = require('pg')
    const client    = new Client ({
        user: "postgres",
        password: "788a829a",
        host: "localhost",
        port: 5432,
        database: "bf_manager"
})
client.connect()
    .then(() => client.query("UPDATE match SET match_state = ($1) WHERE ctid IN(SELECT ctid FROM match WHERE match_name = ($2) AND match_state = ($3) LIMIT 1)", [new_state, name, state]))
    .then(() => client.end())
}