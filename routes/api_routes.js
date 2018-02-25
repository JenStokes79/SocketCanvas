const express = require('express');
const router = express.Router();
const users = require('../api/users.js');
const http = require('http')
const io = require('../server');


let people = {};

/* POST users. */
router.post('/api/users', function(req, res, next) {

    res.json(req.body);
    users.push(req.body)

});

/* GET users. */
router.get('/api/users', function(req, res, next) {

    res.json(users);
});

module.exports = router;

// res.json() username -> associate username with client-id -> 
// persist users in api until disconnection -> store high scores MySQL