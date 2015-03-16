var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')
var operate = require('./operate.js')
var GL = require('./gl.js')

var pts = [
  Vec4(-1, -1, -1, 1),
  Vec4(1, -1, -1, 1),
  Vec4(-1, 1, -1, 1),
  Vec4(1, 1, -1, 1),
  Vec4(-1, -1, 1, 1),
  Vec4(1, -1, 1, 1),
  Vec4(-1, 1, 1, 1),
  Vec4(1, 1, 1, 1)
]

var edges = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
  [0, 2],
  [1, 3],
  [4, 6],
  [5, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7]
]

var theta = 0
var oo = []
var ood = []

for (var i = 0; i < 12; i++) {
  oo.push(Vec4(Math.cos(theta) / 2, 1, Math.sin(theta) / 2, 1))
  theta += Math.PI / 6
}

for (var i = 0; i < oo.length - 1; i++) {
  ood.push([i, i + 1])
}
ood.push([oo.length - 1, 0])

var oldLength = oo.length

for (var i = oldLength; i < oldLength + 12; i++) {
  oo.push(Vec4(Math.cos(theta) / 2, -1, Math.sin(theta) / 2, 1))
  theta += Math.PI / 6
}
for (var i = oldLength; i < oo.length - 1; i++) {
  ood.push([i, i + 1])
}
ood.push([oo.length - 1, oldLength])
for (var i = 0; i < oldLength; i++) {
  ood.push([i, i + oldLength])
}

canvas = document.getElementById('canvas1')
context = canvas.getContext('2d')
w = canvas.width
h = canvas.height

DISTANCE_FROM_CAMERA_TO_ZERO = 6
FOV = 45
ASPECT = w / h
NEAR = 1
FAR = 2200

var gl;

function init() {
  gl = new GL('canvas1');
  gl.initCamera(FOV, ASPECT, NEAR, FAR);
  gl.cameraPosition(0, 0, DISTANCE_FROM_CAMERA_TO_ZERO)

}

var a = 0,
  b = 0;

window.onmousemove = function (e) {
  a = (e.pageX - w / 2) / (w / 2)
  b = (e.pageY - h / 2) / (w / 2)
}

function render() {
  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height)

  var time = Date.now() * 0.001
  var x = Math.cos(time)
  var y = Math.sin(time)

  gl.reset();

  gl.rotateX(a)
  gl.rotateY(b)

  gl.pushMatrix();
    gl.translate(x, 0, y);
    gl.rotateX(time);
    gl.scale(0.8, 0.8, 0.8);

    drawThings(pts, edges, 'red');

    // gl.translate(Math.cos(time), Math.sin(time), 0);
    // gl.rotateY(time);

    gl.pushMatrix();
      gl.rotateY(time * 2);
      gl.scale(0.6, 0.6, 0.6);
      drawThings(pts, edges, 'green');

    gl.popMatrix();
  gl.popMatrix();

  gl.pushMatrix();
  gl.scale(0.2, 0.2, 0.2);
  gl.rotateZ(time);
  var grid = 2;
  for (var i = 0; i < grid; i++) {
    gl.translate(i * .5, 0, 0);
    for (var j = 0; j < grid; j++) {
      gl.translate(0, j * .5, 0);
      gl.translate(0, Math.sin(time + i / grid + j / grid), Math.cos(time + i / grid + j / grid));
      drawThings(pts, edges, 'white');
    }
  }
  gl.popMatrix();

  // gl.reset()

  //gl.scale(1.5, 1.5, 1.5);
  //gl.popMatrix();
  gl.translate(Math.sin(time), 0, Math.cos(time * 2) * 2);
  gl.rotateX(time);

  drawThings(oo, ood, 'yellow');

}

function animate() {
  requestAnimationFrame(animate)
  render()
}

function drawThings(pointArray, edgeArray, color) {
  for (var i = 0; i < edgeArray.length; i++) {
    var pointToDraw1 = gl.drawPoint(pointArray[edgeArray[i][0]]);
    var pointToDraw2 = gl.drawPoint(pointArray[edgeArray[i][1]]);

    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(pointToDraw1[0], pointToDraw1[1]);
    context.lineTo(pointToDraw2[0], pointToDraw2[1]);
    context.stroke();
  }
}

init()
animate()