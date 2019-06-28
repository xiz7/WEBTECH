var sqlSelectUser = "SELECT password FROM user WHERE username = ?";
var sqlSelectLib = "SELECT imageName AS name, stars, date(dateAdded, 'unixepoch') AS dateAdded, " + 
            "imageurl FROM examples ORDER BY stars DESC;";
var sqlSelectLibbyDate = "SELECT imageName AS name, stars, date(dateAdded, 'unixepoch') AS dateAdded, " + 
            "imageurl FROM examples ORDER BY dateAdded DESC;";
var sqlInsertUser = "INSERT INTO user (username, password) VALUES (?,?)";
var sqlUpdateLib = "UPDATE examples SET stars = " +
                    "(SELECT stars FROM examples WHERE imageName = ?) + 1 " +
                    "WHERE imageName = ?";
var sqlInsertLib = "INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES(?, ?,strftime('%s',?), ?)";

module.exports = {
    sqlSelectUser: sqlSelectUser,
    sqlSelectLib: sqlSelectLib,
    sqlSelectLibbyDate: sqlSelectLibbyDate,
    sqlInsertUser: sqlInsertUser,
    sqlUpdateLib: sqlUpdateLib,
    sqlInsertLib: sqlInsertLib
}