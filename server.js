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

// app setup
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Socket.io configuration
var server = require('http').Server(app); //Create a new HTTP Server
var io = require('socket.io')(server); //Use that server to run Socket.io
const PORT = process.env.PORT || 8080; //Set the port
server.listen(PORT); //Listen for activity
module.exports = io;

//routes
const html_routes = require('./routes/html_routes');
const api_routes = require('./routes/api_routes');
app.use('/', html_routes);
app.use('/', api_routes);