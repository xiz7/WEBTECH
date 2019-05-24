
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
query: function(db,username,callback){
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

// login: function(db,username,password,callback){
//     let status;
//     let stmt = db.prepare("SELECT password FROM user WHERE username = ? AND password = ? ");
//       db.serialize(function (){
//         stmt.each([username, password],(err,row) => {
//           if(err){console.log("not printed");}
//           console.log(row);
//           console.log(row.username);
//           console.log(row.password);
//                 if(err || row === undefined){
//                   // res.send('Wrong');
//                    console.log('Wrong');
//                   status = false;
//                 }else{
//                   // res.send('Success');
//                    console.log('Succesfully log in');
//                   status = true;
//                 }
//               }
          
//         ,(status)=>{callback(status);});
//         console.log("status:" + status);
        
//       });

    
//       //stmt.finalize();
   
// },

insert: function(db,username,password){
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

