"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
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

app.get('/login.html', function(req, res){
    res.sendFile(__dirname + "/" + "login.html");
});
app.get('/signup.html', function(req, res){
    res.sendFile(__dirname + "/" + "signup.html");
});

app.post('/login', urlencodedParser, function(req, res){
    // Prepare output in JSON format
    let response = {
        username:req.body.username,
        password:req.body.password
    };
    console.log(response);
    dbAPI.login(db,response.username,response.password,function(status){
            if(status == true){
                console.log("successfully login");
                res.end("<h2>successfully login</h2>");
            }
            else{
                res.end("<h2>wrong name or password!</h2>");
            }
        });
    });






app.post('/signup', urlencodedParser, function(req, res){
    let response = {
        username:req.body.username,
        password:req.body.password
    };
    console.log(response);
    dbAPI.insert(db,response.username, response.password,res);

    
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
