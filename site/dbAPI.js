
var sqlite = require('sqlite3').verbose();
var db;


module.exports = {
// Connect database
connect: function(){
  db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
      console.error(err.message);
    }
  });
},

// close database
close: function(){
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
},

create: function(){
  let stmt = "CREATE TABLE IF NOT EXISTS " +
    "user(" + 
    "userID INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "username VARCHAR(50) UNIQUE NOT NULL, " +
    "password VARCHAR(50) NOT NULL " +
    ");";
  db.serialize(function (){
    db.run(stmt,(err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Table Created.');}
      );
  });
},

drop: function(table){
    let stmt = "DROP TABLE IF EXISTS user;";
    db.serialize(function (){
      db.run(stmt,(err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Table Droped.');}
        );
    });
},




query: function(username,callback){
    let stmt = db.prepare("SELECT password FROM user WHERE username = ?");
      db.serialize(function (){
        stmt.get([username],(err,row) => {
          if (err) {
            return console.error(err.message);
          }
          if(callback && typeof(callback) ==="function"){
            callback(row);
          }
        });
        stmt.finalize();
    });
},

insert: function(username,password){
    let stmt= db.prepare("INSERT INTO user (username, password) VALUES (?,?)");
    db.serialize(function (){
      stmt.run([username,password],(err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Succesfully Inserted.');}
        );
    });
    stmt.finalize();
}
};
