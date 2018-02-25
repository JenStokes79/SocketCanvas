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
    let people = {};
    $.get("/api/users", function(data) {
        console.log('Recieved POST', data);
    });
    client.on('nickname', function(data) {
        client.nickname = data.name;
        console.log('Assigned nickname ', data);
        people[client.nickname] = {
            score: 0,
            is_drawing: false,
            client_id: client.id
        }
        client.emit('people', people)
    });


    // set canvas to half the browser's width and height
    canvas.width = width / 2;
    canvas.height = height / 2;

    //Begin keyboard event handlers
    // register mouse event handlers
    canvas.onmousedown = function(e) { mouse.click = true; };
    canvas.onmouseup = function(e) { mouse.click = false; };

    //Gathers data on mouse position to be emitted as a WebSocket event
    canvas.onmousemove = function(e) {
        let rect = canvas.getBoundingClientRect(); //Returns size of the canvas relative to the viewport
        let offsetX = rect.left; //Gather X and Y coords relative to user's viewport
        let offsetY = rect.top;
        mouse.pos.x = (e.clientX - offsetX) / width; // normalize mouse position to range 0.0 - 1.0
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
        //end key event handlers

    //begin drawing utility functions
    function eraseBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    //Begin Socket.io event handlers
    // draw line received from server
    client.on('draw_line', function(data) {
        let line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        //insert strokeStyle(color) here
        context.stroke();
        //requestAnimationFrame() somewhere for efficiency's sake?
    });


    //erase drawing recieved from the server
    client.on('erase_board', function(data) {
        console.log(data.message);
        eraseBoard();
    });

    // main loop, running every 25ms
    function mainLoop() {
        // check if the user is drawing and emit xy coords to be pushed into line history on the back end
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // send line to to the server
            client.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
            mouse.move = false;
        }
        if (erase) { //user1 erases -> server gets message -> updates client state for all users
            client.emit('erase_board', { message: 'Client to server: User x erased the board' });
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