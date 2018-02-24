const express = require('express');
const router = express.Router();
// const http = require('http')



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home Page' });
});
/* GET game page. */
router.get('/game', function(req, res, next) {
    res.render('game', { title: 'Heroku WebSocket Canvas Deployment' });
});





module.exports = router;