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