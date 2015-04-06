var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')
var operate = require('./operate.js')
var GL = require('./gl.js')

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

var Rule = require('./Rule.js')
var Lsystem = require('./Lsystem.js')
var Turtle = require('./turtle.js')

var ruleset = [];
ruleset[0] = new Rule('F', 'FF+[+F-F-F]-[-F+F+F]');
var lsys = new Lsystem('F', ruleset);
console.log(lsys.getSentence())
var turtle = new Turtle(lsys.getSentence(), 0.1, Math.PI / 7.2);

function render() {
  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height)

  var time = Date.now() * 0.001
    // var x = Math.cos(time)
    // var y = Math.sin(time)

  gl.reset();

  // gl.rotateX(a)
  // gl.rotateY(b)

  gl.rotateY(time / 10);
  gl.translate(0, -2, 0);

  gl.pushMatrix();
  branch(1)
  gl.popMatrix();

  // gl.pushMatrix();
  //turtle.render(gl);
  //gl.popMatrix();

}

var theta;

function branch(l) {
  //gl.translate(0, -l, 0);
  var p1 = gl.drawPoint([0, 0, 0, 1]);
  var p2 = gl.drawPoint([0, l, 0, 1]);
  // console.log(p1[0], p1[1]);
  // console.log(p2[0], p1[1]);
  lineBetweenTwoPoints(p1, p2);
  gl.translate(0, l, 0);

  l *= 0.66;

  if (l > 0.05) {
    gl.pushMatrix();
    //var ran = Math.floor(Math.random() * 3);
    // ran = 0;
    // switch (ran) {
    // case 0:
    //   gl.rotateZ(Math.PI / 6);
    //   break;
    // case 1:
    //   gl.rotateX(Math.PI / 6);
    //   break;
    // case 2:
    //   gl.rotateY(Math.PI / 6);
    //   break;
    // }
    gl.rotateZ(Math.PI / 6);

    branch(l);
    gl.popMatrix();

    gl.pushMatrix();
    //var ran = Math.floor(Math.random() * 3);
    // ran = 0;
    // switch (ran) {
    // case 0:
    //   gl.rotateZ(-Math.PI / 6);
    //   break;
    // case 1:
    //   gl.rotateX(-Math.PI / 6);
    //   break;
    // case 2:
    //   gl.rotateY(-Math.PI / 6);
    //   break;
    // }
    gl.rotateZ(-Math.PI / 6);
    //console.log('wat')
    branch(l);
    gl.popMatrix();
  }
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

init()
render()
animate()

function map(value, a, b, min, max) {
  return value * (max - min) / (b - a);
}

function lineBetweenTwoPoints(p1, p2) {
  //console.log(gl)
  gl.context.beginPath();
  gl.context.strokeStyle = 'white';
  gl.context.moveTo(p1[0], p1[1]);
  gl.context.lineTo(p2[0], p2[1]);
  gl.context.stroke();
}

// window.onmousedown = function () {
//     gl.pushMatrix();
//     lsys.generate();
//     var t = lsys.getSentence();
//     console.log(t);
//     turtle.setToDo(t);
//     turtle.changeLen(0.5);
//     gl.popMatrix();
//     render();
//   }
// setInterval(function () {
//     gl.pushMatrix();
//     lsys.generate();
//     var t = lsys.getSentence();
//     console.log(t);
//     turtle.setToDo();
//     turtle.changeLen(0.5);
//     gl.popMatrix();
//     render();
//   }, 1000)