"use strict";
const sqlite = require('sqlite3').verbose();

// open databasw in memory
let db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE,(err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database.');
});


db.serialize(select("dogag"));
  

// close database
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
function drop(){
    db.run("Drop table users");
}

function create() {
    db.run("create table users (userID, password)");
}

function select(param){
    let stmt = "SELECT password FROM users WHERE userID = ?"
     db.all(stmt,[param],show);

}

function insert(){


    db.run("insert into users values ('dogag','dog')");
}
//Callback
function show(err, rows) {
    if (err) throw err;
    console.log(rows);
}