const express = require('express');
const router = express.Router();
// const io = require('../server');
// console.log(io);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Heroku WebSocket Deployment' });
});


module.exports = router;
