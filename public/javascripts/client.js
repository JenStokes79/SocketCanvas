// TODO:
// 1. Color swatches.
// 2. Brush thickness
// 3. Erase button
// 4. Once we meet the minimum requirements for a functional drawing board, it's time to introduce game logic
//      Other events to be emitted through Socket.io: 
//       a. Users in the room (server emits users, data is used to determine draw on/off)
//       b. Game Data: Points, Wins, Current Word, Current Turn for Drawing, Chats, etc.

document.addEventListener("DOMContentLoaded", function() { //VanillaJS for document.ready
    //Object contains information for tracking uer's mouse
    let mouse = {
        click: false,
        move: false,
        pos: { x: 0, y: 0 },
        pos_prev: false
    };
    // get canvas element and create context
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    //connects socket.io to wherever we need given the context
    let client = io.connect(window.location.host);

    // set canvas to half the browser's width and height
    canvas.width = width / 2;
    canvas.height = height / 2;

    // register mouse event handlers
    canvas.onmousedown = function(e) { mouse.click = true; };
    canvas.onmouseup = function(e) { mouse.click = false; };

    //Gathers data on mouse position to be emitted as a WebSocket event
    canvas.onmousemove = function(e) {
        //Returns size of the canvas relative to the viewport
        let rect = canvas.getBoundingClientRect();
        //Gather X and Y coords relative to user's viewport
        let offsetX = rect.left;
        let offsetY = rect.top;
        // normalize mouse position to range 0.0 - 1.0
        mouse.pos.x = (e.clientX - offsetX) / width;
        mouse.pos.y = (e.clientY - offsetY) / height;
        mouse.move = true;
    };
    let erase = false;
    //Begin keypress shortcuts
    document.onkeypress = function(e) {
        let x = e.which || e.keyCode;
        if (x === 120) { //if 'X' key is pressed, erase lines
            erase = true;
        }
    }

    // draw line received from server
    client.on('draw_line', function(data) {
        let line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    // // erase drawing recieved from the server
    client.on('erase_board', function(data) {
        eraseBoard();
    });

    function eraseBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // main loop, running every 25ms
    function mainLoop() {
        // check if the user is drawing
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // send line to to the server
            client.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
            mouse.move = false;
        }
        if (erase) { //user1 erases -> server gets message -> updates client state for all users
            client.emit('erase_board', 'Client to server: User x erased the board');
            erase = false;
        }
        //if  not drawing, assign values to pos_prev to begin the drawing process
        mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
        setTimeout(mainLoop, 25); //recursive loop every 25ms
    }
    mainLoop();
});

// socket flow: 
// user event -> server gets message and emits event back to client -> client recieves message updates state