var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')
var operate = require('./operate.js')
var GL = require('./gl.js')
var Noise = require('./noise.js')
var N = new Noise();

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

// var instruction = document.createElement('p');
// instruction.innerHTML = 'Keep Press mouse down to see the tree';
// instruction.setAttribute('id', 'instruction');
// document.body.appendChild(instruction);

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

  gl.reset();

  gl.rotateX(a)
  gl.rotateY(b)

  gl.rotateY(time / 10);
  gl.translate(0, -2, 0);

  gl.pushMatrix();
  branch(1, time / 10);
  gl.popMatrix();
}

var points = []

var mousedown = false;

window.onmousedown = function () {
  mousedown = true;
  //branch();
}
window.onmouseup = function () {
  mousedown = false;
}

function branch(len, time) {
  //gl.translate(0, -l, 0);
  var p1 = gl.drawPoint([0, 0, 0, 1]);
  var p2 = gl.drawPoint([0, len, 0, 1]);
  // console.log(p1[0], p1[1]);
  // console.log(p2[0], p1[1]);
  lineBetweenTwoPoints(p1, p2);
  gl.translate(0, len, 0);

  len *= 0.7;
  //l += Math.random() * 0.1 - 0.05;

  if (len > 0.05) {
    //console.log('left')
    gl.pushMatrix();
    var ran = Math.round(N.noise(len, time));
    ran = Math.round(Math.sin(len * 50));
    var theta = N.noise(len, time);
    theta = Math.PI / 6;
    switch (ran) {
    case 0:
      gl.rotateZ(theta);
      break;
    case 1:
      gl.rotateX(theta);
      break;
    case -1:
      gl.rotateY(theta);
      break;
    }
    branch(len);
    gl.popMatrix();

    //console.log('right')
    gl.pushMatrix();
    var ran = Math.round(N.noise(len, time));
    ran = Math.round(Math.sin(len * 100));
    var theta = N.noise(len, time);
    theta = -Math.PI / 6;
    switch (ran) {
    case 0:
      gl.rotateZ(theta);
      break;
    case 1:
      gl.rotateX(theta);
      break;
    case -1:
      gl.rotateY(theta);
      break;
    }
    branch(len);
    gl.popMatrix();

  }
}

function lineBetweenTwoPoints(p1, p2) {
  //console.log(gl)
  gl.context.beginPath();
  gl.context.strokeStyle = 'white';
  gl.context.moveTo(p1[0], p1[1]);
  gl.context.lineTo(p2[0], p2[1]);
  gl.context.stroke();
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

init()
render()
animate()