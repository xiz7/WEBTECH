"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs")

// create application/x-www-form-urlencoded parder
var urlencodedParser = bodyParser.urlencoded({extended:false});

app.use(express.static('public'));
app.use(urlencodedParser);

app.get('/login.html', function(req, res){
    res.sendFile(__dirname + "/" + "login.html");
});

app.post('/login', urlencodedParser, function(req, res){
    // Prepare output in JSON format
    let response = {
        username:req.body.username,
        password:req.body.password
    };
    console.log(response);
    if(dbapi.login(response.username, response.password) == true){
        console.log("successfully login");
        res.end("<h2>successfully login</h2>");
    }
    else{
        res.end("<h2>wrong name or password!</h2>");
    }
});

app.post('/signup', urlencodedParser, function(req, res){
    let response = {
        username:req.body.username,
        password:req.body.password
    };
    console.log(response);
    if(dbapi.isUserExist(response.username) == true){
        console.log("user exists");
        res.end("<h2>user exists</h2>");
    }
    else{
        dbapi.insert(response.username, response.password);
        console.log("successfully sign up");
        res.end("<h2>successfully sign up</h2>");
    }
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
})