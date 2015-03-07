(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/main.js":[function(require,module,exports){
var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')
var operate = require('./operate.js')

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

var w, h, canvas, context

function init() {
  canvas = document.getElementById('canvas1')
  w = canvas.width
  h = canvas.height
  context = canvas.getContext('2d')
}

function depthPerspective(p) {
  var focalLength = 8.0
  var pz = focalLength / (focalLength - p[2])
  return [p[0] * pz, p[1] * pz, pz]
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var time = Date.now() * 0.001
  var x = Math.cos(time) / 2
  var y = Math.sin(time) / 2
  var matrix = Mat4.translate(x, y, 0)

  for (var i = 0; i < edges.length; i++) {

    var p0 = operate.multiply(matrix, pts[edges[i][0]])
    var p1 = operate.multiply(matrix, pts[edges[i][1]])

    var a = depthPerspective(p0)
    var b = depthPerspective(p1)

    context.beginPath()
    context.moveTo(w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1])
    context.lineTo(w / 2 + w / 4 * b[0], h / 2 - w / 4 * b[1])
    context.stroke()
  }
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

init()
animate()
},{"./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js","./operate.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/operate.js","./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js":[function(require,module,exports){
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
    0, Math.sin(theta), Math.cos(theta), 0,
    0, 0, 0, 1
  )
}

Mat4.rotateY = function (theta) {
  return Mat4(
    Math.cos(theta), 0, Math.cos(theta), 0,
    0, 1, 0, 0,
    Math.sin(theta), 0, Math.sin(theta), 0,
    0, 0, 0, 1
  )
}

Mat4.rotateZ = function (theta) {
  return Mat4(
    Math.cos(theta), Math.sin(theta), 0, 0,
    Math.sin(theta), Math.cos(thesta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
}

Mat4.transform = function (src, dst) {
  //haha this one is tricky:)

}
},{"./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/operate.js":[function(require,module,exports){
var Vec4 = require('./vec4.js')
var Mat4 = require('./mat4.js')

module.exports.multiply = multiply
module.exports.dot = dot

function multiply(mat4, something) {
  if (something[4]) {
    //something is a matrix
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
  if (something[3]) {
    //something is a vec4
    var bVec4 = something
    return aVec4[0] * bVec4[0] + aVec4[1] * bVec4[1] + aVec4[2] * bVec4[2] + aVec4[3] * bVec4[3]

  } else {
    //something is a value
    return aVec4[0] * something + aVec4[1] * something + aVec4[2] * something + aVec4[3] * something
  }
}
},{"./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js","./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js":[function(require,module,exports){
module.exports = Vec4

function Vec4(x, y, z, w) {
  return new Float32Array([x || 0, y || 0, z || 0, w || 0])
}
},{}]},{},["/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/main.js"]);
