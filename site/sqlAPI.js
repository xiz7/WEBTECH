
var sqlite = require('sqlite3').verbose();
var db;

function concatData(allRecords, callback){
    let infoArray = [];
    let i = 0;
    let length = allRecords.length;
    while(i < length){
        let info = allRecords[i].dateAdded+ ' | (' + allRecords[i].stars+ ') ' + 'stars';
        let jsonstring = {info:info, title:allRecords[i].name, imageurl:allRecords[i].imageurl};
        infoArray.push(jsonstring);
        i++;
    }
    callback(infoArray);
};

module.exports = {
// Connect database
connect: function(){
  db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE, (err) => {
    if(err){
      console.error(err.message);
    }
    console.log("Connected to db.")
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


// query data
queryOne: function(sql,params,callback){
    let stmt = db.prepare(sql);
      db.serialize(function (){
        stmt.get(params,(err,row) => {
          if (err) {
            return console.error(err.message);
          }
          if(callback && typeof(callback) ==="function"){
            callback(row);
            console.log("password:"+row);
          }
        });
        stmt.finalize();
    });
},

queryAll: function(sql, callback){
    try{
        var allRecords;
        db.serialize(function() {
            db.all(sql, 
                function(err,rows) {
                    allRecords = rows;
                    concatData(allRecords, function(data){
                        callback(data);
                    });
                });
        });
    } catch (e) {
        return console.error(e.message);
    }
},

// Insert data
insert: function(sql,params,callback){
    let stmt= db.prepare(sql);
    db.serialize(function (){
      stmt.run(params,(err) => {
        if (err) {
          callback(false);
          return console.error(err.message);
        }else{
          callback(true);
          console.log('Successfully inserted.')
        }
      });
    });
    stmt.finalize();
},

// Update data
update: function (sql,params, callback){
    try{
        let stmt= db.prepare(sql);
        stmt.run(params, (err) =>{
            if(err){
                callback(false);
                return console.log(err);
            }
            else{
                callback(true);
                console.log('Successfully updated.')
            }
        });
        stmt.finalize();
    } catch(e) {
        return console.error(e.message);
    }
}


};
