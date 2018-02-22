// TODO:
// 1. Color swatches.
// 2. Brush thickness
// 3. Erase button
// 4. Once we meet the minimum requirements for a functional drawing board, it's time to introduce game logic
//      Other events to be emitted through Socket.io: 
//       a. Users in the room
//       b. Game Data: Points, Wins, Current Word, Current Turn for Drawing, Chats, etc.

document.addEventListener("DOMContentLoaded", function() { //VanillaJS for document.ready
    //Object contains information for tracking uer's mouse
    var mouse = {
        click: false,
        move: false,
        pos: { x: 0, y: 0 },
        pos_prev: false
    };
    // get canvas element and create context
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight;
    var client = io.connect(window.location.host); //connects to wherever we need given the context

    // set canvas to half the browser's width and height
    canvas.width = width / 2;
    canvas.height = height / 2;

    // register mouse event handlers
    canvas.onmousedown = function(e) { mouse.click = true; };
    canvas.onmouseup = function(e) { mouse.click = false; };

    //Gathers data on mouse position to be emitted as a WebSocket event
    canvas.onmousemove = function(e) {
        //Returns size of the canvas relative to the viewport
        var rect = canvas.getBoundingClientRect();
        //Gather X and Y coords relative to user's viewport
        var offsetX = rect.left;
        var offsetY = rect.top;
        // normalize mouse position to range 0.0 - 1.0
        mouse.pos.x = (e.clientX - offsetX) / width;
        mouse.pos.y = (e.clientY - offsetY) / height;
        mouse.move = true;
    };

    // draw line received from server
    client.on('draw_line', function(data) {
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    // main loop, running every 25ms
    function mainLoop() {
        // check if the user is drawing
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // send line to to the server
            client.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
            mouse.move = false;
        }
        //if  not drawing, assign values to pos_prev to begin the drawing process
        mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
        setTimeout(mainLoop, 25); //recursive loop every 25ms
    }
    mainLoop();
});