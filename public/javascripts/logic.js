client.on('join', function(data) { //move to game.js
    console.log(data);
    //check the amount of users present 
    if (Object.keys(data).length < 2) {
        $('#status_msg').text('Waiting for more people... Feel free to draw!')
    } else if (Object.keys(data).length >= 2) {
        $('#status_msg').text('Let the games begin!')
            //io.emit initialize game
    }
    //update users list on DOM
    $('#user').html('');
    for (key in data) {
        $('#user').append(`<div>${data[key].name}<br>wins: ${data[key].wins}<br><br></div>`)
    }
})

//Handle disconnect on client side
client.on('disconnect', function(data) {
    console.log(data);
    if (Object.keys(data).length < 2) {
        $('#status_msg').text('Waiting for more people... Feel free to draw!')
    } else if (Object.keys(data).length >= 2) {
        $('#status_msg').text('Let the games begin!')
            //io.emit initialize game
    }
    $('#user').html('');
    for (key in data) {
        $('#user').append(`<div>${data[key].name}<br>wins: ${data[key].wins}<br><br></div>`)
    }
});