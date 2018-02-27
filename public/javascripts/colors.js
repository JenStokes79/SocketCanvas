//array to create color palette
var colors = ['blue', 'red', 'yellow', 'green', 'orange', 'purple', 'black'];
let current_color = '';


for (var i = 0, n = colors.length; i < n; i++) {
    var swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[i];
    swatch.addEventListener('click', setSwatch);
    document.getElementById('colors').appendChild(swatch);
}

function setColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;
    var active = document.getElementsByClassName('active')[0];
    if (active) {
        active.className = 'swatch';
    }
}

function setSwatch(e) {
    //identify swatch
    var swatch = e.target;
    //set color
    setColor(swatch.style.backgroundColor);
    //give active class
    //leave space in active to separate classes
    swatch.className += ' active ';
    current_color = swatch.style.backgroundColor;
}

setSwatch({ target: document.getElementsByClassName('swatch')[0] });