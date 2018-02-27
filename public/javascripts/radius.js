//var applies to all the diff variables when set up on this manner
var minRad = 1,
    maxRad = 100,
    defaultRad = 2,
    interval = 2,
    radSpan = document.getElementById('radval'),
    decRad = document.getElementById('decrad'),
    incRad = document.getElementById('incrad'),
    radius = 2;



var setRadius = function(newRadius) {
    if (newRadius < minRad)
        newRadius = minRad;
    else if (newRadius > maxRad)
        newRadius = maxRad;
    radius = newRadius;
    radSpan.innerHTML = radius;
}




decRad.addEventListener('click', function() {
    setRadius(radius - interval);

});
incRad.addEventListener('click', function() {
    setRadius(radius + interval);

});