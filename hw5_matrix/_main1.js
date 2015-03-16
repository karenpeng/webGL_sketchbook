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

theta = 0
var oo = []
var ood = []
  // for (var i = 0; i < 12; i++) {
  //   oo.push(Vec4(Math.cos(theta), 1, Math.sin(theta), 1))
  //     //oo.push(Vec4(Math.cos(theta), -1, Math.sin(theta), 1))
  //   theta += Math.PI / 6
  // }
  // ood = [
  //   // [0, 1],
  //   // [2, 3],
  //   // [4, 5],
  //   // [6, 7],
  //   // [8, 9],
  //   // [10, 11],
  //   // [12, 13],
  //   // [14, 15],
  //   // [16, 17],
  //   // [18, 19],
  //   // [20, 21],
  //   // [22, 23],

//   // [0, 2],
//   // [2, 4],
//   // [4, 6],
//   // [6, 8],
//   // [8, 10],
//   // [10, 12],
//   // [12, 14],
//   // [14, 16],
//   // [16, 18],
//   // [18, 20],
//   // [20, 22]
//   //[22, 0]

//   // [1, 3],
//   // [3, 5],
//   // [5, 7],
//   // [7, 9],
//   // [9, 11],
//   // [11, 13],
//   // [13, 15],
//   // [15, 17],
//   // [17, 19],
//   // [19, 21],
//   // [22, 23],
//   // [23, 1]
// ]

// for (var i = 0; i < 12; i++) {

// ood = [
//   [0, 1],
//   [1, 2],
//   [2, 3],
//   [3, 4],
//   [4, 5],
//   [5, 6],
//   [6, 7],
//   [7, 8],
//   [8, 9],
//   [9, 10],
//   [10, 11],
//   [11, 0]

//   [0, 1],
//   [1, 2],
//   [2, 3],
//   [3, 4],
//   [4, 5],
//   [5, 6],
//   [6, 7],
//   [7, 8],
//   [8, 9],
//   [9, 10],
//   [10, 11],
//   [11, 0]
// ]

for (var i = 0; i < 12; i++) {
  oo.push(Vec4(Math.cos(theta) / 2, 1, Math.sin(theta) / 2, 1))
    //console.log(oo[i][0])
  theta += Math.PI / 6
    //console.log(oo[i])
}

for (var i = 0; i < oo.length - 1; i++) {
  ood.push([i, i + 1])
}
ood.push([oo.length - 1, 0])

//console.log(ood)

var oldLength = oo.length

for (var i = oldLength; i < oldLength + 12; i++) {
  oo.push(Vec4(Math.cos(theta) / 2, -1, Math.sin(theta) / 2, 1))
  theta += Math.PI / 6
    //console.log(oo[i])
}

for (var i = oldLength; i < oo.length - 1; i++) {
  ood.push([i, i + 1])
}
ood.push([oo.length - 1, oldLength])
  //console.log(ood)
  // for (var i = 0; i < ood.length; i++) {
  //   console.log(ood[i][0])
  // }
for (var i = 0; i < oldLength; i++) {
  ood.push([i, i + oldLength])
}

console.log(ood)

//console.log(oo.length)
ood.forEach(function (item) {
    console.log(item[0], item[1])
  })
  // oo.forEach(function (item) {
  //   console.log(item[0], item[2])
  // })
var w, h, canvas, context

var DISTANCE_FROM_CAMERA_TO_CANVAS, FOV, ASPECT, NEAR, FAR, transformMatrix

//var gui = new dat.GUI()
//gui.add(text, '')
//console.log(oo.length + ' ' + ood.length)

function init() {
  canvas = document.getElementById('canvas1')
  w = canvas.width
  h = canvas.height
  context = canvas.getContext('2d')
  DISTANCE_FROM_CAMERA_TO_CANVAS = 60
  DISTANCE_FROM_CAMERA_TO_ZERO = 3
  FOV = 45
  ASPECT = w / h
  NEAR = 10
  FAR = 220
  STAGE = 0

  var count = 0

  //console.log(oo[ood[25][1]])

  function justforyou(p) {
    //console.log(count + ' ' + p)
    var out = []
    out[0] = (w / 2) + p[0] * (w / 2)
    out[1] = p[1]
    out[2] = (h / 2) - p[2] * (w / 2)
      //console.log(out)
    count++
    return out
  }

  for (var i = 0; i < oo.length; i++) {
    var newp = justforyou(oo[i])
      //console.log(newp[0], newp[2])
    context.beginPath()
    context.lineWidth = "2";
    context.strokeStyle = "red";
    context.fillText(i, newp[0], newp[2])
    context.stroke()
  }

  var counter = 0
  for (var i = 0; i < ood.length; i++) {

    context.beginPath()
    var p0 = justforyou(oo[ood[i][0]])
    context.moveTo(p0[0], p0[2])
    var p1 = justforyou(oo[ood[i][1]])
      // console.log(counter)
      // console.log(oo[ood[i][1]])
    context.lineTo(p1[0], p1[2])
    context.stroke()
    counter++
  }
}

window.onkeydown = function (e) {
  switch (e.which) {
  case 65:
    STAGE = 0
    console.log(65)
    break
  case 66:
    STAGE = 1
    console.log(66)
    break
  case 67:
    STAGE = 2
    break
  case 68:
    STAGE = 3
    break
  case 69:
    STAGE = 4
    break
  }
}

function switchMatrix(time, x, y) {
  switch (STAGE) {
  case 0:
    transformMatrix = Mat4.translate(x, y, 0)
    matrixStack.push(transformMatrix)
    break
  case 1:
    transformMatrix = Mat4.rotateX(x)
    matrixStack.push(transformMatrix)
    break
  case 2:
    transformMatrix = Mat4.rotateY(y)
    matrixStack.push(transformMatrix)
    break
  case 3:
    transformMatrix = Mat4.rotateZ(x)
    matrixStack.push(transformMatrix)
    break
  case 4:
    transformMatrix = Mat4.scale(x, x, 1)
    matrixStack.push(transformMatrix)
    break
  }
}

var matrixStack = []

function multiplyThemAll(matrixStack, vec4) {
  this.nVec4 = vec4
  this.matrixStack = matrixStack
}

multiplyThemAll.prototype.exec = function () {
  //console.log(this.matrixStack.length)
  if (this.matrixStack.length) {
    var matrix = this.matrixStack.shift()
      //console.log(this.matrixStack.length)
    this.nVec4 = operate.multiply(matrix, this.nVec4)
      //console.log(this.nVec4)
    this.exec()
      //console.log('o')
  } else {
    console.log(this.nVec4)
    return this.nVec4
  }
}

STAGE = 0
switchMatrix()

var i = 0
var ddd = new multiplyThemAll(matrixStack, pts[edges[i][0]])

// var O1 = Vec4(ddd.exec())
//var O1 = ddd.exec()
//console.log(O1)

// matrixStack.forEach(function(item){
//   document.getElementById('info').innerHTML += (item[0]+' '+item)
// })
//
//  transformMatrix = Mat4.translate(x, y, 0)

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  var time = Date.now() * 0.001
  var x = Math.cos(time) / 2
  var y = Math.sin(time) / 2
  switchMatrix(time, x, y)

  var rotateXM = Mat4.rotateX(x)

  var rotateYM = Mat4.rotateY(y)

  var rotateZM = Mat4.rotateZ(x)

  var scaleM = Mat4.scale(x, x, 1)

  var eyeMatrix = Mat4.translate(0, 0, DISTANCE_FROM_CAMERA_TO_ZERO)
  var projectionMatrix = Mat4.perspective(FOV, ASPECT, NEAR, FAR)
  var mat4 = Mat4()
    //console.log(mat4[4])
    //console.log(rotateXM)
  mat4 = operate.multiply(mat4, rotateXM)
  mat4 = operate.multiply(mat4, rotateYM)
    //mat4 = operate.multiply(mat4, rotateZM)
    //mat4 = operate.multiply(mat4, scaleM)
  mat4 = operate.multiply(mat4, Mat4.translate(0, Math.sin(time) / 2, 0))
    //console.log(mat4)
    // GL.push(rotateXM)

  // GL.push(rotateYM)
  //
  //var gl = new GL();

  for (var i = 0; i < edges.length; i++) {

    var p0 = operate.multiply(Mat4.inverse(eyeMatrix), operate.multiply(mat4, pts[edges[i][0]]))
    var p1 = operate.multiply(Mat4.inverse(eyeMatrix), operate.multiply(mat4, pts[edges[i][1]]))

    trick(p0, p1)

    var a = operate.multiply(projectionMatrix, p0)
    var b = operate.multiply(projectionMatrix, p1)

    //var newM1 = operate.multiply()

    //trick(a, b)
    // var a = [],
    //   b = []

    // a[0] = p0[0] * DISTANCE_FROM_CAMERA_TO_CANVAS / (p0[2] + DISTANCE_FROM_CAMERA_TO_ZERO)
    // a[1] = p0[1] * DISTANCE_FROM_CAMERA_TO_CANVAS / (p0[2] + DISTANCE_FROM_CAMERA_TO_ZERO)
    // a[2] = DISTANCE_FROM_CAMERA_TO_CANVAS - DISTANCE_FROM_CAMERA_TO_ZERO
    // b[0] = p1[0] * DISTANCE_FROM_CAMERA_TO_CANVAS / (p0[2] + DISTANCE_FROM_CAMERA_TO_ZERO)
    // b[1] = p1[1] * DISTANCE_FROM_CAMERA_TO_CANVAS / (p0[2] + DISTANCE_FROM_CAMERA_TO_ZERO)
    // b[2] = DISTANCE_FROM_CAMERA_TO_CANVAS - DISTANCE_FROM_CAMERA_TO_ZERO
    // console.log(a)

    // var a = p0
    // var b = p1
    // context.beginPath()
    // context.moveTo(viewport(a)[0], viewport(a)[1])
    // context.lineTo(viewport(b)[0], viewport(b)[1])
    // context.stroke()

    context.beginPath();
    //context.fillText(i, w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1])
    context.strokeStyle = "red";
    context.moveTo(w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1]);
    context.lineTo(w / 2 + w / 4 * b[0], h / 2 - w / 4 * b[1]);
    context.stroke();
  }

  //console.log(oo[0])
  // mat4 = Mat4()
  //console.log(mat4[4])
  //console.log(rotateXM)
  var translateM = Mat4.translate(Math.sin(time), 0, Math.cos(time));
  mat4 = operate.multiply(mat4, Mat4.rotateX(time))
  mat4 = operate.multiply(mat4, translateM)
    //mat4 = operate.multiply(mat4, rotateYM)
    //mat4 = operate.multiply(mat4, rotateZM)

  for (var j = 0; j < ood.length; j++) {

    var p0 = operate.multiply(Mat4.inverse(eyeMatrix), operate.multiply(mat4, oo[ood[j][0]]))
    var p1 = operate.multiply(Mat4.inverse(eyeMatrix), operate.multiply(mat4, oo[ood[j][1]]))
      //console.log(ood[i][0])
      // var p0 = operate.multiply(Mat4.inverse(eyeMatrix), oo[ood[i][0]])
      // var p1 = operate.multiply(Mat4.inverse(eyeMatrix), oo[ood[i][1]])
      //console.log(p0)
      // var a = depthPerspective(p0)
      // var b = depthPerspective(p1)
    trick(p0, p1)

    var a = operate.multiply(projectionMatrix, p0)
    var b = operate.multiply(projectionMatrix, p1)

    //trick(a, b)

    context.beginPath();
    //context.fillText(i, w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1])
    context.strokeStyle = "green";
    context.moveTo(w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1]);
    context.lineTo(w / 2 + w / 4 * b[0], h / 2 - w / 4 * b[1]);
    context.stroke();
  }

  // for (var i = 0; i < oo.length - 1; i++) {
  //   var p = operate.multiply(Mat4.inverse(eyeMatrix), operate.multiply(transformMatrix, oo[i]))
  //   var a = depthPerspective(p)
  //   var p1 = operate.multiply(Mat4.inverse(eyeMatrix), operate.multiply(transformMatrix, oo[i + 1]))
  //   var a1 = depthPerspective(p1)
  //   context.beginPath()
  //   context.lineWidth = "2";
  //   context.strokeStyle = "red";
  //   context.fillText(i, w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1])
  //   context.moveTo(w / 2 + w / 4 * a[0], h / 2 - w / 4 * a[1])
  //   context.lineTo(w / 2 + w / 4 * a1[0], h / 2 - w / 4 * a1[1])
  //   context.stroke()
  // }
}

function trick(p0, p1) {

  p0[0] = p0[0] / p0[2]
  p0[1] = p0[1] / p0[2]

  p1[0] = p1[0] / p1[2]
  p1[1] = p1[1] / p1[2]
}

function viewport(p) {
  var out = [];
  out[0] = (w / 2) + p[0] / p[2] * (w / 2)
  out[1] = (h / 2) - p[1] / p[2] * (w / 2)
  return out
}

function viewport2d(p) {
  var out = [];
  out[0] = (w / 2) + p[0] * (w / 2)
  out[1] = (h / 2) - p[1] * (w / 2)
  return out
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

init()
animate()