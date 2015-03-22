var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')
var operate = require('./operate.js')
var GL = require('./gl.js')
var util = require('./util.js')
var shapes = require('./shapes.js')

canvas = document.getElementById('canvas1')
context = canvas.getContext('2d')
w = canvas.width
h = canvas.height

DISTANCE_FROM_CAMERA_TO_ZERO = 6
FOV = 45
ASPECT = w / h
NEAR = 1
FAR = 2200

var nu = 16
var nv = 16

var gl;

var startTime

function init() {
  gl = new GL('canvas1');
  gl.initCamera(FOV, ASPECT, NEAR, FAR);
  gl.cameraPosition(0, 0, DISTANCE_FROM_CAMERA_TO_ZERO)
  startTime = Date.now() * 0.001
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
  var laspe = time - startTime
  var x = Math.cos(time)
  var y = Math.sin(time)

  gl.reset();

  gl.rotateX(a)
  gl.rotateY(b)

  gl.pushMatrix();
  gl.translate(1, 1, 0);
  util.renderObject(10, 10, shapes.blob, gl, 'red', laspe);
  gl.popMatrix();

  gl.pushMatrix();
  //gl.rotateX(time);
  gl.translate(-1, 1, 0);
  gl.scale(0.5, 0.5, 0.5);
  util.renderObject(10, 10, shapes.pointOnBlanket, gl, 'white', laspe);
  gl.popMatrix();

  gl.pushMatrix();
  gl.translate(-0.5, -0.8, 0);
  gl.translate(x, 0, y);
  gl.rotateX(time);
  gl.scale(0.8, 0.8, 0.8);

  //drawThings(pts, edges, 'red');

  gl.pushMatrix();
  gl.scale(1.2, 1.2, 1.2);
  util.renderObject(10, 10, shapes.pointOnBagel, gl, 'green');
  gl.popMatrix();
  // gl.translate(Math.cos(time), Math.sin(time), 0);
  // gl.rotateY(time);

  gl.pushMatrix();
  gl.rotateY(time * 2);
  gl.scale(0.6, 0.6, 0.6);
  //drawThings(pts, edges, 'green');
  util.renderObject(10, 10, shapes.pointOnSphere, gl, 'yellow');

  gl.rotateX(time)

  gl.pushMatrix();
  gl.scale(0.3, 0.3, 0.3)
  util.renderObject(4, 4, shapes.pointOnSphere, gl, 'white');
  gl.popMatrix();

  gl.translate(Math.cos(time), Math.sin(time), 0)
  gl.scale(0.3, 0.3, 0.3)
  util.renderObject(4, 4, shapes.pointOnSphere, gl, 'white');

  gl.popMatrix();
  gl.popMatrix();

  gl.pushMatrix();
  gl.translate(1, -1, 0)
  gl.scale(0.5, 0.5, 0.5);
  gl.rotateZ(time);

  util.renderObject(10, 10, shapes.pointOnCylinder, gl);

  gl.popMatrix();

  // gl.reset()

  gl.scale(0.5, 0.5, 0.5);
  //gl.popMatrix();
  gl.translate(Math.sin(time), 0, Math.cos(time * 2) * 2);
  gl.rotateX(time);

  //drawThings(oo, ood, 'yellow');

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
  //render()
animate()