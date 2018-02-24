//todo: 
// - create a namespace
// - limit max number of connections
// - convert drawing to data URI and email with nodemailer?

//native modules
const path = require('path');
const http = require("http");
const bodyParser = require("body-parser");


//third-party modules
const express = require('express');

//routes
const index = require('./routes/index');
const api_routes = require('./routes/api_routes');

// app setup
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use('/', index);
app.use('/', api_routes);


//Socket.io configuration
var server = require('http').Server(app); //Create a new HTTP Server
var io = require('socket.io')(server); //Use that server to run Socket.io
const PORT = process.env.PORT || 8080; //Set the port
server.listen(PORT); //Listen for activity

// Store previously drawn lines in this array so 
// when newcomers join, the whole drawing renders
let line_history = [];

io.on('connection', function(server) { //handles new connections
    //1. emit line history to new client, which will draw pre-existing lines from the entire session
    for (var i in line_history) {
        server.emit('draw_line', { line: line_history[i] });
    }
    //TODO: Add users to array and handle max number of users allowed in the room

    //2 .add handler that handles message draw_line when emitted frome existing connections
    server.on('draw_line', function(data) {
        //add the recieved line to line_history
        line_history.push(data.line);
        // send line to all clients
        io.emit('draw_line', { line: data.line });
    });

    //3. add handler for erase_board
    server.on('erase_board', function(data) {
        console.log(data.message);
        //erase line history
        line_history = [];
        // send line to all clients
        io.emit('erase_board', { message: 'Server to client: User x erased the board' });
    });

    //4. Create handler for user disconnect
    //Code goes here

});

// server -> emit an event to client -> client recieves the event -> emit event back to server

module.exports = {
    app
}