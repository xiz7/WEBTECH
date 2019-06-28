"use strict";

const express = require('express');
const app = express();
const https = require("https");
const bodyParser = require('body-parser');
const path = require('path');
const sqlAPI = require("./sqlAPI.js");
const users = require("./routes/users");
const designers = require("./routes/designers");
const session = require('express-session');
const mongoose = require('mongoose');
const fs = require("fs");

// create application/x-www-form-urlencoded parder
var urlencodedParser = bodyParser.urlencoded({extended:false});

// Connect to the database
sqlAPI.connect();
mongoose.connect("mongodb://localhost:27017/webtech", {useNewUrlParser: true})
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Could not connect MongoDB because:",err.message));

app.use(express.static('public'));
app.use(urlencodedParser);
app.use(bodyParser.json());

app.use(session({
    secret :  'secret', // sign related cookie
    resave : true,
    saveUninitialized: false, 
    cookie : {
        maxAge : 1000 * 60 * 3, // set time
    },
}));

function requireLogin(req, res, next) {
    console.log(req.session);
    // require the user to log in
    if (req.session.userName){
        console.log("pass");
        next(); // allow the next route to run
    } else {
        console.log("not pass");
        res.redirect("/login.html");// render a form
  }
}
app.get('/index', function(req, res){
     res.sendFile(path.resolve("public/index.html"));
 });
app.get('/login', function(req, res){
     res.sendFile(path.resolve("public/login.html"));
 });

app.get('/display',requireLogin,function(req, res){
     res.sendFile(path.resolve("public/display.html"));  
 });

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  console.log(req.url);
  next();
});

app.use('/users', users);
app.use('/designers', designers);

app.all('*', function(req, res) {
    throw new Error("Bad request")
})
app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).json("Your request is not allowed");
        console.log(e.stack);
    }
});

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app)
.listen(3001, 'localhost',function(){
    console.log("running https server on port 3001");
});
