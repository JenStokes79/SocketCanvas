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

var server = require('http').Server(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

server.listen(PORT);

io.on('connection', function (server) {
  
  setInterval(() => server.emit('server', new Date().toTimeString()), 1000);
  
  server.on('client', function (data) {
    console.log(data);
  });
  server.on('client', function (data) {
    console.log(data);
  });
  server.on('disconnect', function () {
    io.emit('user disconnected');
  });
});
      


module.exports = {
  app
}

