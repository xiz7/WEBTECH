const sqlite3 = require('sqlite3').verbose();

const dbPath = './test.db'

const sqlSelect = "SELECT imageName AS name, comments, date(dateAdded, 'unixepoch') AS dateAdded, " + 
            "imageurl FROM examples ORDER BY comments DESC;";
const sqlInsert = "INSERT INTO examples(imageName, comments, dateAdded, imageurl) VALUES(?, ?,strftime('%s',?), ?)";
module.exports = {

concatData: function (allRecords, callback){
    let infoArray = [];
    let i = 0;
    let length = allRecords.length;
    while(i < length){
        let info = allRecords[i].dateAdded+ ' | (' + allRecords[i].comments+ ') ' + 'comments';
        let jsonstring = {info:info, title:allRecords[i].name, imageurl:allRecords[i].imageurl};
        infoArray.push(jsonstring);
        i++;
    }
    callback(infoArray);
},

// db.all gives an array of data back
// whereas db.get gives an object of data back
selectAll: function(concatData, sendbackData){
    try{
        var db = connectDB();
        var allRecords;
        db.serialize(function() {
            db.all(sqlSelect, 
                function(err,rows) {
                    allRecords = rows;
                    concatData(allRecords, function(data){
                        sendbackData(data);
                    });
                    closeDB(db);
                });
        });
    } catch (e) {
        return console.error(e.message);
    }
},

insertRecord: function(params, callback){
    try{
        var db = connectDB();
        db.run(sqlInsert, params, (err) =>{
            if(err){
                callback(false);
            }
            else{
                callback(true);
            }
        });
    } catch(e) {
        return console.error(e.message);
    }
}

}

function connectDB(){
    try{
        let db = new sqlite3.Database(dbPath);
        return db;
    } catch(err){
        return console.error(err.message);
    }
}

function closeDB(){
    db.close((err) => {
        if(err){
            return console.error(err.message);
        }
        //console.log("successfully closed DB connection");
    });
}