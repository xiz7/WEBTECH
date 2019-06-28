const express = require('express');
const path = require('path');
const router = express.Router();
const sqlstmt = require('./sqlstmt');
const sqlAPI = require("../sqlAPI");
const fs = require("fs");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended:false});

router.use(urlencodedParser);
router.use(bodyParser.json());
router.use(fileUpload());

router.post('/change',function(req, res) {
    sqlAPI.queryAll(sqlstmt.sqlSelectLib, function(data){
        res.send({success: true, data});
    });
});

router.post('/like', function(req, res){
    let params = [req.body.title, req.body.title];
    sqlAPI.update(sqlstmt.sqlUpdateLib,params, function(status){
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

router.post('/update_index', function(req, res) {
    sqlAPI.queryAll(sqlstmt.sqlSelectLibbyDate, function(data){
        res.send({success: true, data});
    });
});

router.post('/insertRecord', (req, res) => {
    let imageFile = req.files.imagefile;
    let name = imageFile.name.split('.');
    let imagePath = "public/images/" + imageFile.name;
    let i = 1;
    while(fs.existsSync(imagePath)){
        imagePath = "public/images/" + name[0] + "(" + i + ")." + name[1];
        i++;
        console.log('looping...');
    }
    //Using the files to call upon the method to move that file to a folder
    imageFile.mv(imagePath, function(error){
        if(error){
            console.log("Couldn't save the image file");
            console.log(error);
        }else{
            console.log("Image"+ name + " succesfully saved.");
        }
    });
    let params = [
        req.body.title,
        req.body.stars,
        'now',
        "/" + imagePath.split('/')[1] + "/" + imagePath.split('/')[2]
    ];
    console.log(params);
});

router.post('/insertRecord', function(req, res) {
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
    sqlAPI.insert(sqlstmt.sqlInsertLib, params, function(status){
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

module.exports = router;