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
    .then(console.log("Client ok"))
    .then(() => client.query("insert into match(match_name, match_state, match_index) values ($1, $2, $3)", [name, 1, index]))
    .then(() => client.query("select * from match"))
    .then(results => console.table(results.rows))
    .catch(e => console.log("ADD", e))
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
    .then(console.log("Client ok"))
    .then(() => client.query("DELETE FROM match WHERE ctid IN(SELECT ctid FROM match WHERE match_name = ($1) AND match_state = ($2) LIMIT 1)", [name, state]))
    .then(() => client.query("select * from match"))
    .then(results => console.table(results.rows))
    .catch(e => console.log("RM", e))
    .then(() => client.end())
}

exports.state = async function(name, state, new_state, index) {
    var array_to_json;
    const {Client}  = require('pg')
    const client    = new Client ({
        user: "postgres",
        password: "788a829a",
        host: "localhost",
        port: 5432,
        database: "bf_manager"
})
client.connect()
    .then(console.log("Client ok"))
    .then(() => client.query("UPDATE match SET match_state = ($1) WHERE ctid IN(SELECT ctid FROM match WHERE match_name = ($2) LIMIT 1)", [new_state, name]))
    .then(() => client.query("select * from match"))
    .then(results => console.table(results.rows))
    .catch(e => console.log("state", e))
    .then(() => client.end())
}