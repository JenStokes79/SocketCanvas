// THESE SCRIPTS ARE NO LONGER IN USE, BUT MAY BE GOOD FOR REFERENCE. DO NOT REMOVE YET.
const client = io.connect(window.location.host);
var mousePressed = false;
var lastX, lastY;
var ctx;

$(document).ready(function() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').mousedown(function(e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function(e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function(e) {
        mousePressed = false;
    });
    $('#myCanvas').mouseleave(function(e) {
        mousePressed = false;
    });

});


function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = '5px'
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
    //  client.emit('drawClick', {
    //    x: lastX,
    //    y: lastY
    // });
}