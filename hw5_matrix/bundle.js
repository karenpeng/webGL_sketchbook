(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/karen/Documents/my_project/matrix/functional/gl.js":[function(require,module,exports){
module.exports = GL;

var multiply = require('./operate.js').multiply;
var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')

function GL(id) {
  this.stack = [];
  this.currentMatrix = Mat4();
  this.eyeMatrix = Mat4();
  this.projectionMatrix = Mat4();
  this.canvas = document.getElementById(id);
}

GL.prototype.cameraPosition = function (x, y, z) {
  this.eyeMatrix = Mat4.translate(x, y, z)
}

GL.prototype.initCamera = function (fov, aspect, near, far) {
  this.projectionMatrix = Mat4.perspective(fov, aspect, near, far)
}

GL.prototype.popMatrix = function () {
  var element = this.stack.pop();
  if (element === '(') {
    return;
  }
  this.popMatrix();
}

GL.prototype.pushMatrix = function () {
  this.stack.push('(');
}

GL.prototype.multiplyMatrix = function (m) {
  this.stack.push(m);
  this.currentMatrix = Mat4.identity();
  //console.log(this.stack.length)
  for (var i = 0; i < this.stack.length; i++) {
    if (this.stack[i] === '(') continue;
    this.currentMatrix = multiply(this.currentMatrix, this.stack[i]);
  }
}

GL.prototype.reset = function () {
  this.stack = [];
  this.currentMatrix = Mat4();
}

GL.prototype.translate = function (x, y, z) {
  this.multiplyMatrix(Mat4.translate(x, y, z));
}

GL.prototype.rotateX = function (theta) {
  this.multiplyMatrix(Mat4.rotateX(theta));
}

GL.prototype.rotateY = function (theta) {
  this.multiplyMatrix(Mat4.rotateY(theta));
}

GL.prototype.rotateZ = function (theta) {
  this.multiplyMatrix(Mat4.rotateZ(theta));
}

GL.prototype.scale = function (x, y, z) {
  this.multiplyMatrix(Mat4.scale(x, y, z));
}

GL.prototype.transformPoint = function (vec4) {
  //console.log(this.currentMatrix)
  return multiply(this.currentMatrix, vec4)
}

GL.prototype.getEyeCoordinate = function (vec4) {
  return multiply(Mat4.inverse(this.eyeMatrix), vec4)
}

GL.prototype.projectPoint = function (vec4) {
  return multiply(this.projectionMatrix, vec4)
}

GL.prototype.divideW = function (vec4) {
  return Vec4(vec4[0] / vec4[3], vec4[1] / vec4[3], vec4[2] / vec4[3], 1)
}

GL.prototype.viewport = function (vec4) {
  var out = [];
  out[0] = (this.canvas.width / 2) + vec4[0] * (this.canvas.width / 2)
  out[1] = (this.canvas.height / 2) - vec4[1] * (this.canvas.width / 2)
  return out;
}

GL.prototype.drawPoint = function (vec4) {
  var point = this.transformPoint(vec4)
    //console.log(point)
  point = this.getEyeCoordinate(point)

  point = this.projectPoint(point)

  point = this.divideW(point)
    // console.log(point)
  point2D = this.viewport(point)
    //console.log(point2D)
  return point2D
}
},{"./mat4.js":"/Users/karen/Documents/my_project/matrix/functional/mat4.js","./operate.js":"/Users/karen/Documents/my_project/matrix/functional/operate.js","./vec4.js":"/Users/karen/Documents/my_project/matrix/functional/vec4.js"}],"/Users/karen/Documents/my_project/matrix/functional/main.js":[function(require,module,exports){
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
},{"./gl.js":"/Users/karen/Documents/my_project/matrix/functional/gl.js","./mat4.js":"/Users/karen/Documents/my_project/matrix/functional/mat4.js","./operate.js":"/Users/karen/Documents/my_project/matrix/functional/operate.js","./vec4.js":"/Users/karen/Documents/my_project/matrix/functional/vec4.js"}],"/Users/karen/Documents/my_project/matrix/functional/mat4.js":[function(require,module,exports){
module.exports = Mat4;

var Vec4 = require('./vec4.js')

function Mat4(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
  return new Float32Array([
    a00 || 1, a01 || 0, a02 || 0, a03 || 0,
    a10 || 0, a11 || 1, a12 || 0, a13 || 0,
    a20 || 0, a21 || 0, a22 || 1, a23 || 0,
    a30 || 0, a31 || 0, a32 || 0, a33 || 1
  ])
}

Mat4.identity = function () {
  return Mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
}

Mat4.translate = function (x, y, z) {
  return Mat4(
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  )
}

Mat4.scale = function (x, y, z) {
  return Mat4(
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  )
}

Mat4.rotateX = function (theta) {
  return Mat4(
    1, 0, 0, 0,
    0, Math.cos(theta), Math.sin(theta), 0,
    0, -Math.sin(theta), Math.cos(theta), 0,
    0, 0, 0, 1
  )
}

Mat4.rotateY = function (theta) {
  return Mat4(
    Math.cos(theta), 0, -Math.sin(theta), 0,
    0, 1, 0, 0,
    Math.sin(theta), 0, Math.cos(theta), 0,
    0, 0, 0, 1
  )
}

Mat4.rotateZ = function (theta) {
  return Mat4(
    Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
}

Mat4.transform = function (src, dst) {
  //haha this one is tricky:)

}

Mat4.inverse = function (m) {
  var out = Mat4(
    m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10], -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10],
    m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6], -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6],

    -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10],
    m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10], -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6],
    m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6],

    m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9], -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9],
    m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5], -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5],

    -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9],
    m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9], -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5],
    m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5]
  )

  var det = m[0] * out[0] + m[1] * out[4] + m[2] * out[8] + m[3] * out[12]
  for (var i = 0; i < 16; i++) out[i] /= det
  return out

}

// Mat4.perspective = function (fov, aspect, near, far) {
//   var f = 1 / Math.tan(fov / 2),
//     nf = 1 / (near - far)
//   var out = Mat4(
//     f / aspect, 0, 0, 0,
//     0, f, 0, 0,
//     0, 0, (far + near) * nf, -1,
//     0, 0, (2 * far * near) * nf, 0
//   )
//   return out
// }

Mat4.perspective = function (fov, aspect, near, far) {
  var y = Math.tan(fov * Math.PI / 360) * near;
  var x = y * aspect;
  return Mat4.frustum(-x, x, -y, y, near, far);
};

// ### GL.Matrix.frustum(left, right, bottom, top, near, far[, result])
//
// Sets up a viewing frustum, which is shaped like a truncated pyramid with the
// camera where the point of the pyramid would be. You can optionally pass an
// existing matrix in `result` to avoid allocating a new matrix. This emulates
// the OpenGL function `glFrustum()`.
Mat4.frustum = function (l, r, b, t, n, f) {
  return Mat4(
    2 * n / (r - l), 0, (r + l) / (r - l), 0,
    0, 2 * n / (t - b), (t + b) / (t - b), 0,
    0, 0, -(f + n) / (f - n), -2 * f * n / (f - n),
    0, 0, -1, 0
  )

}
},{"./vec4.js":"/Users/karen/Documents/my_project/matrix/functional/vec4.js"}],"/Users/karen/Documents/my_project/matrix/functional/operate.js":[function(require,module,exports){
var Vec4 = require('./vec4.js')
var Mat4 = require('./mat4.js')

module.exports.multiply = multiply
module.exports.dot = dot

function multiply(mat4, something) {
  //console.log(something)
  if (something[4] !== undefined) {
    //something is a matrix
    //console.log('!')
    var aMat4 = mat4;
    var bMat4 = something;
    var out = Mat4(
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15])),

      dot(Vec4(aMat4[4], aMat4[5], aMat4[6], aMat4[7]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[4], aMat4[5], aMat4[6], aMat4[7]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[4], aMat4[5], aMat4[6], aMat4[7]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[4], aMat4[5], aMat4[7], aMat4[7]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15])),

      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15])),

      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15]))
    )
    return out;

  } else {
    //something is a vec4
    var vec4 = something;
    var out = Vec4(
        dot(Vec4(mat4[0], mat4[1], mat4[2], mat4[3]), vec4),
        dot(Vec4(mat4[4], mat4[5], mat4[6], mat4[7]), vec4),
        dot(Vec4(mat4[8], mat4[9], mat4[10], mat4[11]), vec4),
        dot(Vec4(mat4[12], mat4[13], mat4[14], mat4[15]), vec4)
      )
      //console.log(out)
    return out

  }

}

function dot(aVec4, something) {
  if (something[3] !== undefined) {
    //something is a vec4
    var bVec4 = something
    return aVec4[0] * bVec4[0] + aVec4[1] * bVec4[1] + aVec4[2] * bVec4[2] + aVec4[3] * bVec4[3]

  } else {
    //something is a value
    return aVec4[0] * something + aVec4[1] * something + aVec4[2] * something + aVec4[3] * something
  }
}
},{"./mat4.js":"/Users/karen/Documents/my_project/matrix/functional/mat4.js","./vec4.js":"/Users/karen/Documents/my_project/matrix/functional/vec4.js"}],"/Users/karen/Documents/my_project/matrix/functional/vec4.js":[function(require,module,exports){
module.exports = Vec4

function Vec4(x, y, z, w) {
  return new Float32Array([x || 0, y || 0, z || 0, w || 0])
}
},{}]},{},["/Users/karen/Documents/my_project/matrix/functional/main.js"]);
