// Javascript to create a storymap by Klas Karlsson 2014-05-29

function fadeOut(element) {
    var op = element.style.opacity;
    var timer = setInterval(function () {
        if (op <= 0){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op -= 0.05; // this row and the next sets the speed of the fade-out
    }, 4);
}
function fadeIn(element) {
    var op = 0;  // Start Opacity when fading in
    var timer = setInterval(function () {
        if (op >= storyOpacity){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op += 0.04; // this row and the next sets the speed of the fade-in
    }, 20);
}
function changeStory(position, title, id, content) {
	fadeOut(document.getElementById(id)), // Fade out function
	map.panTo(position, { // Pan map to new location
		animate:true,
		duration:panTime
	}),
	setTimeout(function() { // Wait for a number of miliseconds and then fade in the new story.
		document.getElementById(id).innerHTML = content
		fadeIn(document.getElementById(id))
	}, 650);
	
}
if (baseMap=="osm") {
	var mapType = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { // This is the background map
	 attribution: 'Open Street Map'
	});
}
if (baseMap=="toner") {
	var mapType = new L.StamenTileLayer("toner");
}
if (baseMap=="terrain") {
	var mapType = new L.StamenTileLayer("terrain");
}
if (baseMap=="watercolor") {
	var mapType = new L.StamenTileLayer("watercolor");
}
if (baseMap=="mapbox") {
	var mapType = L.tileLayer('https://{s}.tiles.mapbox.com/v3/username.mapid/{z}/{x}/{y}.png'); // set your own mapbox username.mapid
}
var positions = L.layerGroup([]); // This group layer holds dynamically created markers
var map = L.map('map', { // Create the map and set the start position and zoom
 center: startCoordinate,
 zoom: startZoom,
 layers: [mapType, positions]
});

L.control.scale({imperial:false, maxWidth:300}).addTo(map); // Simple scale bar

document.getElementById('title').style.opacity = titleOpacity; // Opacity for the title element
document.getElementById('story').style.opacity = storyOpacity; // Opacity for the story element
document.getElementById('title').style.color = titleTextColor;
document.getElementById('title').style.background = titleBackground;
document.getElementById('story').style.color = storyTextColor;
document.getElementById('story').style.background = storyBackground;
var storyTag = document.getElementById('story');
var links = storyTag.getElementsByTagName('a');
for (var i = 0; 1<links.length; i++) {
	links[i].style.color = storyTextColor;
};
document.getElementById('rewind').style.color = storyTextColor;



var num = -1;
var showPopUp = true; // Sets a default value, change in html-file
window.onload = function() {
	changeStory(startCoordinate, 'Startpage', 'story', startText); //	 Show start story when page has loaded
};

var rewind = document.getElementById('rewind'); // A separate function for stepping backwards in the story
rewind.onclick = function() {
    try {	
	num -= 1;
	positions.clearLayers(); // Remove any markers
	if (useMarker) {
	if (showPopUp) { // Add new marker and pop-up visible or not
		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]).openPopup();
	} else {
		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]);
	};
	};
	changeStory(position[num], bubbleText[num], 'story', storyText[num]); // change the story (function)
    } catch(err) { // If it was the first story do the same, but show the start story again.
	num = -1,
	positions.clearLayers(),
	changeStory(startCoordinate, 'Startpage', 'story', startText),
	setTimeout(function() {
		map.setZoom(startZoom)
	}, panTime * 1000);
    }
};

map.on('click', function() { // Function to forward the story when clicking in the map
   try {
	num += 1;
	positions.clearLayers(); // Remove any markers
	if (useMarker) {
	if (showPopUp) { // Add new marker and pop-up visible or not
		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]).openPopup();
	} else {
		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]);
	};
	};
	changeStory(position[num], bubbleText[num], 'story', storyText[num]); // change the story (function)
   } catch(err) { // If this was the last story do the same, but show the start styry and start again.
	fadeOut(document.getElementById('story')),
	num = -1,
	positions.clearLayers(),
	changeStory(startCoordinate, 'Startsida', 'story', startText),
	setTimeout(function() {
		map.setZoom(startZoom)
	}, panTime * 1000);
   }
});

