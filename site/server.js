"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
var multer  = require('multer');
var upload = multer();

var dbAPI = require("./dbAPI.js");

// create application/x-www-form-urlencoded parder
var urlencodedParser = bodyParser.urlencoded({extended:false});

// SQLITE3
const sqlite = require('sqlite3').verbose();
//open database
var db = new sqlite.Database("./data.db", sqlite.OPEN_READWRITE,(err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
  });



app.use(express.static('public'));
app.use(urlencodedParser);
app.use(bodyParser.json());
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
app.get('/signup.html', function(req, res){
    res.sendFile(__dirname + "/" + "signup.html");
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
    dbAPI.query(db,response.username,function(row){
            if(row == undefined){
                console.log("Wrong username!");
                res.send(false);
            }
            else{
                if(row.password == response.password){
                    console.log("successfully login");
                    res.send(true);
                }else{
                    console.log("Wrong password!");
                    res.send(false);
                }  
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

    dbAPI.query(db,response.username, function(row){
        if(row == undefined){
            dbAPI.insert(db,response.username,response.password);
            console.log("successfully signed!");
            res.send(true);

        }else{
                console.log("Existed username!");
                res.send('exist');
        }
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
var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
