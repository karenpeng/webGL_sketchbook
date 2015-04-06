var vid = document.getElementById('videoel');
var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

function enablestart() {
  var startbutton = document.getElementById('startbutton');
  startbutton.value = "start";
  startbutton.disabled = null;
}

document.getElementById('startbutton').onclick = function(){
  startVideo();
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
// check for camerasupport
if (navigator.getUserMedia) {
  // set up stream
  var videoSelector = {video : true};
  if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
    var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    if (chromeVersion < 20) {
      videoSelector = "video";
    }
  };

  navigator.getUserMedia(videoSelector, function( stream ) {
    if (vid.mozCaptureStream) {
      vid.mozSrcObject = stream;
    } else {
      vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }
    vid.play();
  }, function() {
    alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
  });
} else {
  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}
vid.addEventListener('canplay', enablestart, false);

var can = document.getElementById('cover');
var ctx = can.getContext('2d');
exports.eye1 = [0,0];
exports.eye2 = [0,0];
exports.checking = false;

function startVideo() {
  // start video
  vid.play();
  exports.checking = true;
  // start tracking
  ctrack.start(vid);
  // start loop to draw face
  drawLoop();
}

function drawLoop() {
  requestAnimFrame(drawLoop);
  ctx.clearRect(0, 0, 800, 600);
  ctx.drawImage(vid, 0, 0, 800, 600);
  //overlayCC.clearRect(0, 0, 400, 300);
  //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
  if (ctrack.getCurrentPosition()) {
    var positions = ctrack.getCurrentPosition();
    // ctrack.draw(overlay);
    ctx.fillStyle = 'white';
    var a = fromVideoToCanvas(positions[27]);
    ctx.fillRect(a[0], a[1], 10, 10);
    var b = fromVideoToCanvas(positions[32]);
    ctx.fillRect(b[0], b[1], 10, 10);
    exports.eye1 = inverseViewPort(positions[27]);
    exports.eye2 = inverseViewPort(positions[32]);
    //console.log(exports.eye1)
  }
}

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
  stats.update();
}, false);


var w = 120;
var h = 90;

function fromVideoToCanvas(p){
  return [p[0]* 800/120, p[1]* 800/120];
}
function inverseViewPort(p){
  var x = p[0] / w * 2 - 1;
  var y = p[1] / h * 2 - 1;
  return [x, y];
}
