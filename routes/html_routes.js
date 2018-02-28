const express = require('express');
const router = express.Router();
const http = require('http')
const users = require('../api/users.js');
const io = require('../server');

/* GET test page. */
router.get('/test', function(req, res, next) {
    res.render('test', { title: 'Awwww yeahhh' });
});

/* GET game page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Heroku WebSocket Canvas Deployment' });
});

// Store previously drawn lines in this array so 
// when newcomers join, the whole drawing renders
let line_history = [];
let line_rad = 2;
//A data hash storing important information for each user
let people = {};
//handles new connections
io.on('connection', function(server) {

    for (key in people) {
        if (server.id != people[key].client_id) {
            console.log(`${server.id} is lurking`)
        }
    }

    //When users hit GO, store their info in the hash for reference in-game
    server.on('join', function(data) {
        people[data.name] = data;
        server.name = data.name;
        io.emit('join', people)
            // console.log('Current room: ', people);
            // console.log(server.name, server.id)
            //bad describer, should be socket.name
    });

    server.on('disconnect', function() {
        for (key in people) {
            if (people[key].client_id === server.id) {
                //io.emit to client
                console.log(`${people[key].name} disconnected`)
                delete people[key];
                console.log(`Updated room: ${JSON.stringify(people)}`);
            }
            io.emit('disconnect', people);
        }
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
        io.emit('erase_board', people);
    });

    //add handler for init_game
    server.on('init_game', function() {
        io.emit('init_game', people);
    });

    server.on('user_drawing', function(data) {
        // console.log('New data: ', data)
        //emit to the user drawing
        server.emit('user_drawing', `you are drawing!`);
        //emit to entire namespace
        io.emit('message', `${data} is drawing!`);
    });
    server.on('user_guessing', function(data) {
        server.emit('user_guessing', 'you are guessing');
    });

});


module.exports = router;