const express = require('express');
const router = express.Router();
const http = require('http')
const users = require('../api/users.js');
const io = require('../server');

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Get ready...' });
// });

/* GET game page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Heroku WebSocket Canvas Deployment' });

});

// Store previously drawn lines in this array so 
// when newcomers join, the whole drawing renders
let line_history = [];
//A data hash storing important information for each user
let people = {};

//handles new connections
io.on('connection', function(server) {

    let client_name = server.name;
    //When users hit GO, store their info in the hash for reference in-game
    server.on('join', function(data) {
        people[data.name] = data;
        client_name = data.name;
        io.emit('join', people)
            // console.log(server.name); //bad describer, should be socket.name
    });

    //emit line history to new client, which will draw pre-existing lines from the entire session
    for (var i in line_history) {
        server.emit('draw_line', { line: line_history[i] });
    }

    //add handler that handles message draw_line 
    server.on('draw_line', function(data) {
        //add the recieved line to line_history
        line_history.push(data.line);
        // send line to all clients
        io.emit('draw_line', { line: data.line });
    });

    //add handler for erase_board
    server.on('erase_board', function(data) {
        console.log(data.message);
        //erase line history
        line_history = [];
        // send line to all clients
        io.emit('erase_board', { message: 'Server to client: User x erased the board' });
    });

});

//TODO: Handle join, handle leave

module.exports = router;