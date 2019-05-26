"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var bcrypt = require('bcrypt');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
var multer  = require('multer');
var upload = multer();

var sqlAPI = require("./sqlAPI.js");

// create application/x-www-form-urlencoded parder
var urlencodedParser = bodyParser.urlencoded({extended:false});

var sqlCreateUser = "CREATE TABLE IF NOT EXISTS " +
    "user(" + 
    "userID INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "username VARCHAR(50) UNIQUE NOT NULL, " +
    "password VARCHAR(50) NOT NULL " +
    ");"; 
var sqlDropUser = "DROP TABLE IF EXISTS user;";
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


// Connect to the database
sqlAPI.connect();


app.use(express.static('public'));
app.use(urlencodedParser);
app.use(bodyParser.json());


function requireLogin(req, res, next) {
    // require the user to log in
    var theme=localStorage.getItem("user");
    if (theme==null||theme=="") {
    res.redirect("/login.html"); // render a form
    } else {

    console.log("pass");
    next(); // allow the next route to run

  }
}


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/login.html', function(req, res){
    res.sendFile(__dirname + "/" + "login.html");
});

app.get('/display.html', requireLogin, function(req, res){
    res.sendFile(__dirname + "/" + "display.html");
});

app.post('/login', upload.array(), function(req, res){
    // Prepare output in JSON format
    let formData = Object.values(req.body);
    console.log('form data:', formData[0]);
    let response = {
        username:formData[0][0],
        password:formData[0][1]
    };
    console.log(response);
    sqlAPI.queryOne(sqlSelectUser,[response.username],function(row){
            if(row == undefined){
                console.log("Wrong username!");
                res.send(false);
            }
            else{
                bcrypt.compare(response.password, row.password, function(err, result) {
                if(result) {
                    console.log("successfully login");
                    res.send(true);
                } else {
                    console.log("Wrong password!");
                    res.send(false);
                 } 
                });
            }
        });
    });

app.post('/signup', upload.array(), function(req, res){

    let formData = Object.values(req.body);
    console.log('form data:', formData[0]);
    let response = {
        username:formData[0][0],
        password:formData[0][1]
    };

    sqlAPI.queryOne(sqlSelectUser,[response.username], function(row){
        if(row == undefined){
            bcrypt.hash(response.password, 10, function(err, hash) {
                if(err){
                    return console.error(err);
                }
                console.log("hash:"+hash);
                // Store hash in database
                sqlAPI.insert(sqlInsertUser,[response.username,hash],function(status){
                    if(status){
                        res.send(true);
                        console.log('Succesfully Inserted.');
                    }else{
                        res.send(false);
                       console.log("Inserted failure.");
                    }

                });
                
            });
        }else{
                console.log("Existed username!");
                res.send('exist');
        }
    });

    
});

app.post('/change', function(req, res) {
    sqlAPI.queryAll(sqlSelectLib, function(data){
        console.log(data[0].imageurl);
        res.send({success: true, data});
    });
});

app.post('/like', function(req, res){
    let params = [req.body.title, req.body.title];
    console.log(params);
    sqlAPI.update(sqlUpdateLib,params, function(status){
        if(status){
            let path = __dirname + "/success.html";
            res.sendFile(path);
        }
        else{
            let path = __dirname + "/failure.html";
            res.sendFile(path);
        }
    })
});

app.post('/update_index', function(req, res) {
    sqlAPI.queryAll(sqlSelectLibbyDate, function(data){
        res.send({success: true, data});
    });
});

app.post('/file_upload', function(req, res){
    console.log(req.files.file.name);
    console.log(req.files.file.path);
    console.log(req.files.file.type);
    var file = __dirname + "/" + req.files.file.name;

    fs.readFile(req.files.file.path, function(err, data){
        fs.writeFile(file, data, function(err){
            if(err){
                console.log(err);
            }
            else{
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files.file.name
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        })
    })
})

app.all('*', function(req, res) {
    throw new Error("Bad request")
})
app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).json({error: {msg: e.message, stack: e.stack}});
    }
});

var server = app.listen(3000,'localhost', function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
