
var sqlite = require('sqlite3').verbose();

module.exports = {


// close database
close: function(db){
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
},

create: function(db){
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

drop: function(db){
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
query: function(db,param){
    let stmt = db.prepare("SELECT password FROM user WHERE username = ?");
      db.serialize(function (){
        stmt.all([param],(err,rows) => {
          if (err) {
            return console.error(err.message);
          }
           if (rows[0] == undefined){
             return false;
           }else{

             return true;
           }
          }
        );
    });
    stmt.finalize();
},

login: function(db,username,password,callback){
  let status;
    //let stmt = db.prepare("SELECT password FROM user WHERE username = ? AND password = ? ");
    let sql = "SELECT * FROM user WHERE username = ? AND password = ?";
      db.serialize(function (){
        db.each(sql,[username, password],(err,rows) => {
          console.log("err:" + err);
          console.log("row:" + rows);
          console.log("pswd:" + password);
          if(err){console.log("not printed");}
          console.log(rows);
          console.log(rows.username);
          console.log(rows.password);
          console.log(rows[0] === undefined);
                if(err || rows === undefined){
                  // res.send('Wrong');
                   console.log('Wrong');
                  status = false;
                }else{
                  // res.send('Success');
                   console.log('Succesfully log in');
                  status = true;
                }
              }, function(){
                callback(status);
              }
          
        );
      });

    
      //stmt.finalize();
   
},

insert: function(db,username,password,res){
    let stmt= db.prepare("INSERT INTO user (username, password) VALUES (?,?)");
    db.serialize(function (){
      stmt.run([username,password],(err) => {
        if (err) {
          res.send('User already exits');
          return console.error(err.message);
        }
        res.send('Success');
        console.log('Succesfully Inserted.');}
        );
    });
    stmt.finalize();
}
};
