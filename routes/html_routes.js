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
//A data hash storing important information for each user
let people = {};
let game_in_progress = false;
//handles new connections
io.on('connection', function(server) {
    if (Object.keys(people).length < 2) {
        server.emit('abort_game');
        game_in_progress = false;
    }

    //handle non-game members lurking on the page while game in progress
    for (key in people) {
        if (server.id != people[key].client_id) {
            console.log(`${server.id} is lurking`)
            server.emit('lurkers');
        }
    }



    server.on('abort_game', function() {
        game_in_progress = false;
    })

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
        game_in_progress = true;
        console.log('game is true')
        io.emit('init_game', people);
        io.emit('erase_board', people);
        line_history = [];
        //handle non-game members lurking on the page pre-game
        for (key in people) {
            if (server.id != people[key].client_id) {
                console.log(`${server.id} is lurking`)
                server.emit('lurkers');
            }
        }

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
    server.on('rand_word', function(data) {
        console.log(`Server recieved the word ${data}`);
    })

});


module.exports = router;