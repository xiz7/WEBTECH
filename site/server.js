"use strict";

const express = require('express');
const app = express();
const https = require("https");
const bodyParser = require('body-parser');
const fs = require("fs");
const bcrypt = require('bcrypt');
const sqlAPI = require("./sqlAPI.js");
const fileUpload = require('express-fileupload');
const session = require('express-session');


// create application/x-www-form-urlencoded parder
var urlencodedParser = bodyParser.urlencoded({extended:false});


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
app.use(fileUpload());

app.use(session({
    secret :  'secret', // sign related cookie
    resave : true,
    saveUninitialized: false, 
    cookie : {
        maxAge : 1000 * 60 * 3, // set time
    },
}));

function requireLogin(req, res, next) {
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
     res.sendFile(__dirname + "/public/" + "index.html");
 });
app.get('/login', function(req, res){
     res.sendFile(__dirname + "/public/" + "login.html");
 });

app.get('/display',requireLogin,function(req, res){
     res.sendFile(__dirname + "/public/" + "display.html");  
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


app.post('/login', function(req, res){
    // Prepare output in JSON format
    let formData = Object.values(req.body);
    console.log('form data:', formData[0]);
    let response = {
        username:formData[0][0],
        password:formData[0][1]
    };
    if(!/^[A-Za-z0-9]+$/.test(response.username)){
        return console.error("Wrong username!");
    }
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
                    req.session.userName = response.username;
                    res.send(true);
                } else {
                    console.log("Wrong password!");
                    res.send(false);
                 } 
                });
            }
        });
    });

app.post('/signup', function(req, res){

    let formData = Object.values(req.body);
    console.log('form data:', formData);
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
                        req.session.userName = response.username;
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
app.post('/logout', function (req, res) {
    console.log("Log out");
    req.session.userName = null; // delete session
    res.redirect('login');
});

app.post('/change',function(req, res) {
    sqlAPI.queryAll(sqlSelectLib, function(data){
        res.send({success: true, data});
    });
});

app.post('/like', function(req, res){
    let params = [req.body.title, req.body.title];
    sqlAPI.update(sqlUpdateLib,params, function(status){
        if(status){
            console.log("like updated");
            let path = __dirname + "/success.html";
            res.send({success:true});
        }
        else{
            console.log("like updated fail");
            let path = __dirname + "/failure.html";
            res.send({success:false});
        }
    })
});

app.post('/update_index', function(req, res) {
    sqlAPI.queryAll(sqlSelectLibbyDate, function(data){
        res.send({success: true, data});
    });
});


app.post('/insertRecord', function(req, res) {
    //a variable representation of the files
    let imageFile = req.files.imagefile;
    let name = imageFile.name.split('.');
    let imagePath = "public/images/" + imageFile.name;
    let i = 1;
    while(fs.existsSync(imagePath)){
        imagePath = "public/images/" + name[0] + "(" + i + ")." + name[1];
        i++;
    }
    //Using the files to call upon the method to move that file to a folder
    imageFile.mv(imagePath, function(error){
        if(error){
            console.log("Couldn't upload the image file");
            console.log(error);
        }else{
            console.log("Image file succesfully uploaded.");
        }
    });
    let params = [
        req.body.title,
        req.body.stars,
        'now',
        "/" + imagePath.split('/')[1] + "/" + imagePath.split('/')[2]
    ];
    console.log(params);
    sqlAPI.insert(sqlInsertLib, params, function(status){
        if(status){
            let path = __dirname + "\\public\\display.html";
            console.log(path);
            res.sendFile(path);
        }
        else{
            let path = __dirname + "\\public\\display.html";
            console.log(path);
            res.sendFile(path);
        }
    });
})

app.all('*', function(req, res) {
    throw new Error("Bad request")
})
app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).json({error: {msg: e.message, stack: e.stack}});
    }
});

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app)
.listen(3001, 'localhost',function(){
    console.log("example app listening on 3001");
})
