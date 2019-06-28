const express = require('express');
const router = express.Router();
const path = require('path');
const sqlAPI = require("../sqlAPI");
const sqlstmt = require('./sqlstmt');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {userSchema, validate} = require('../models/user');

router.post('/login', async (req, res) => {
    let formData = Object.values(req.body);
    const user = {
        username: formData[0][0],
        password: formData[0][1]
    };
    const {error} = validate(user);
    if(error) return console.error("invalid user")

    const lookup = await userSchema.find({
        $and: [
            {username: user.username}
        ]
    });
    if(lookup == "") {
        console.log("wrong username");
        res.send(false);
    }
    else{
        bcrypt.compare(user.password, lookup[0].password, (err, result) => {
            if(err) return console.error(err);
            if(result) {
                console.log("successfully login");
                req.session.userName = user.username;
                console.log(req.session.userName);
                res.send(true);
            } 
            else {
                console.log("Wrong password!");
                res.send(false);
            } 
        });
    }
})

router.post('/signup', async (req, res) => {
    let formData = Object.values(req.body);
    const user = {
        username: formData[0][0],
        password: formData[0][1]
    };
    const {error} = validate(user);
    if(error) return console.error("invalid user")

    const lookup = await userSchema.find({
        $and: [
            {username: user.username}
        ]
    });
    console.log(lookup);
    console.log("comparision result:", lookup == "");
    // if no such user in MongoDB, then insert a new user
    if(lookup == ""){
        bcrypt.hash(user.password, 10, (err, hash) => {
            if(err) return console.error(err);
            user.password = hash;
            const result = new userSchema(user)
                .save()
                .catch(err => {
                    console.error(err.message);
                    console.log("Inserted failure.");
                });
            req.session.userName = user.username;
            res.send(true);
            console.log('Succesfully Inserted.');
        });
    }
    else{
        res.send('exist');
        console.log("User exists.");
    }
});

router.post('/logout', function (req, res) {
    console.log("Log out");
    req.session.userName = null; // delete session
    res.redirect('../login');
});

module.exports = router;