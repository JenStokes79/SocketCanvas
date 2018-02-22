//native modules
const path = require('path');
const http = require("http");

//third-party modules
const express = require('express');

//routes
const index = require('./routes/index');

// app setup
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use('/', index);
app.use(express.static(path.join(__dirname, 'public')));

//Socket.io configuration
var server = require('http').Server(app); //Create a new HTTP Server
var io = require('socket.io')(server); //Use that server to run Socket.io
const PORT = process.env.PORT || 8080; //Set the port
server.listen(PORT); //Listen for activity

// Store previously drawn lines in this array so 
// when newcomers join, the whole drawing renders
let line_history = [];

io.on('connection', function(server) { //handles new connections
    //1. send line history to new client, draws lines in history
    for (var i in line_history) {
        server.emit('draw_line', { line: line_history[i] });
    }
    //2 .add handler that handles message draw_line
    server.on('draw_line', function(data) { //adds lines to history
        //add the recieved line to line_history
        line_history.push(data.line);
        // send line to all clients
        io.emit('draw_line', { line: data.line });
    });
    //3. Create handler for erase_board
    //Code goes here
    server.on('erase_board', function(data) { //adds lines to history
        //add the recieved line to line_history
        line_history = [];
        // send line to all clients
        io.emit('erase_board', { erase: 'Server to client: User x erased the board' });
    });

    //4. Create handler for user disconnect
    //Code goes here
});



module.exports = {
    app
}