(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/bezier.js":[function(require,module,exports){
module.exports = Bezier;

var Vec3 = require('./vec3.js');

function Bezier() {
}

//t should be from 0 to 1 right?
Bezier.getCoord = function (t, points) {
  if (points === undefined || points.length < 3) {
    return;
  }

  // more than 3 points
  if (points.length > 3) {
    var newPoints = [];

    for (var i = 0; i < points.length - 1; i++) {
      newPoints[i] = new Vec3();
      newPoints[i].x = (1 - t) * points[i].x + t * points[i + 1].x;
      newPoints[i].y = (1 - t) * points[i].y + t * points[i + 1].y;
    }
    //after the for loop above, newPoints will be one point less

    /* omg recursion! */
    return this.getCoord(t, newPoints);

  // just 3 points
  } else if (points.length === 3) {
    var S = new Vec3();
    var T = new Vec3();
    S[0] = (1 - t) * points[0].x + t * points[1].x;
    S[1] = (1 - t) * points[0].y + t * points[1].y;
    T[0] = (1 - t) * points[1].x + t * points[2].x;
    T[1] = (1 - t) * points[1].y + t * points[2].y;
    var point = new Vec3();
    point.x = (1 - t) * S[0] + t * T[0];
    point.y= (1 - t) * S[1] + t * T[1];
    return point;
  }
}
},{"./vec3.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/vec3.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/draw.js":[function(require,module,exports){
var Bezier = require('./bezier.js');
var Hermite = require('./hermite.js');

exports.drawBezierSpline = function (points, g) {
  var num = points.length;

  if (num < 3) {
    return;
  }

  var ut = 1.0 / (num * 20);
  var res = [];

  for (var t = 0; t < .999; t += ut) {
    res.push(Bezier.getCoord(t, points));
  }

  exports.drawSpline(res, g);
};

exports.drawHermiteSpline = function (P0, P1, R0, R1) {
  var hermite = new Hermite();
  hermite.setParam(P0, P1, R0, R1);

  var ut = 1.0 / 20;
  var res = [];

  for (var t = 0; t < .999; t += ut) {
    res.push(hermite.getCoord(t));
  }

  exports.drawSpline(res, 0);
};

exports.drawSpline = function (vertices, g) {
  //console.log(vertices.length)
  for (var i = 0; i < vertices.length - 1; i++) {
    var p1 = vertices[i];
    var p2 = vertices[i+1];
    g.fillStyle = 'black';
    g.fillRect(p1.x, p1.y, 2, 2);
    g.fillRect(p2.x, p2.y, 2, 2);
    g.strokeStyle = 'black';
    g.beginPath();
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.stroke();
  }
};

exports.outputData = function(vertices){

}

var radius = 6;

exports.drawPoint = function(points, g){
  for (var i = 0; i < points.length; i++) {
    var point = points[i];

    g.beginPath();
    g.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    g.fillStyle = point.color;
    g.fill();
    g.lineWidth = 1;
    g.strokeStyle = '#003300';
    g.stroke();
  }
}

exports.drawAuxiliaryLines = function (points, g) {

  var defaultLineDash = g.getLineDash();
  g.setLineDash([2]);
  g.strokeStyle = 'gray';

  for (var i = 0; i < points.length - 1; i++) {
    var p1 = points[i];
    var p2 = points[i+1];
    g.beginPath();
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.stroke();
  }

  g.setLineDash(defaultLineDash);
}
},{"./bezier.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/bezier.js","./hermite.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/hermite.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/hermite.js":[function(require,module,exports){
module.exports = Hermite;
var Vec3 = require('./vec3.js');

function Hermite() {
  this.P0 = new Vec3();
  this.P1 = new Vec3();
  this.R0 = 0.0;
  this.R1 = 0.0;
  this.matrix = [];

  this.set();
}

Hermite.prototype = {
  set: function () {
    this.matrix = [
      [2, -2, 1, 1],
      [-3, 3, -2, -1],
      [0, 0, 1, 0],
      [1, 0, 0, 0]
    ];
  },
  setParam: function (P0, P1, R0, R1) {
    this.P0 = P0;
    this.P1 = P1;
    this.R0 = R0;
    this.R1 = R1;

  },
  getCoord: function (t) {
    if (this.P0 === undefined || this.P1 === undefined || this.R0 === undefined || this.R1 === undefined) {
      throw "Parameters are not defined...";
    }
    var point = new Vec3();

    for (var i = 0; i < 4; i++) {
      var tmp = Math.pow(t, 3) * this.matrix[0][i] + Math.pow(t, 2) * this.matrix[1][i] + Math.pow(t, 1) * this.matrix[2][i] + Math.pow(t, 0) * this.matrix[3][i];

      switch (i) {
        case 0:
          point[0] += tmp * this.P0[0];
          point[1] += tmp * this.P0[1];
          break;
        case 1:
          point[0] += tmp * this.P1[0];
          point[1] += tmp * this.P1[1];
          break;
        case 2:
          point[0] += tmp * this.R0;
          point[1] += tmp * this.R0;
          break;
        default :
          point[0] += tmp * this.R1;
          point[1] += tmp * this.R1;
      }
    }

    return point;
  }
};
},{"./vec3.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/vec3.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/index.js":[function(require,module,exports){
var Bezier = require('./bezier.js');
var Hermite = require('./hermite.js');
var draw = require('./draw.js');
var Point = require('./point.js');

var canvas = document.getElementById('canvas1');
var cxt = canvas.getContext('2d');

var canvas2 = document.getElementById('canvas2');
var cxt2 = canvas2.getContext('2d');

var points = [];
var pointsMove = [];
var mouseIsDown = false;
var mouseIsOnPoint = false;

points.push(new Point(10,canvas.height - 10));
points.push(new Point(canvas.width - 10, 10));

function init(){
 pointsMove.push(new Point(10,canvas.height - 10));
 for(var i = 0; i < 6; i++){
    pointsMove.push(new Point(
      Math.random()*(canvas2.width-20)+10,
      Math.random()*(canvas2.height-20)+10
    ));
  }
  pointsMove.push(new Point(canvas.width - 10, 10));
}

document.getElementById('start').onclick = function(){
  init();
}

window.onmousedown = function(e){
  //var p = viewPortForMouse(e.pageX, e.pageY);
  mouseIsDown = true;

  if(!mouseIsOnPoint &&
    e.pageX < canvas.width - 10 && e.pageX > 10 &&
    e.pageY < canvas.height - 10 && e.pageY > 10){
    var len = points.length;
    points.splice(len-1, 0, new Point(e.pageX, e.pageY));
  }
}

window.onmousemove = function(e){
  mouseIsOnPoint = false;
  if(points.length >= 3){
    for(var i = 1; i< points.length - 1; i++){
      if(points[i].isDrag(e.pageX, e.pageY)){
        mouseIsOnPoint = true;
        break;
      }
    }
  }


  if(mouseIsDown){
    points.forEach(function(p){
      if(p.dragable){
        p.color = 'red';
        p.set(e.pageX, e.pageY);
      }
    })
  }
}

window.onmouseup = function(){
  mouseIsDown = false;
  points.forEach(function(p){
    p.dragable = false;
  });
}

function animate(){
  cxt.clearRect(0,0, canvas.width, canvas.height);
  if(points.length){
    draw.drawPoint(points, cxt);
    draw.drawBezierSpline(points, cxt);
    draw.drawAuxiliaryLines(points, cxt);
  }

  cxt2.clearRect(0,0, canvas2.width, canvas2.height);
  if(pointsMove.length){

    //pointsMove.forEach(function(p){
    for(var i = 1; i< pointsMove.length -1; i++){
      var p = pointsMove[i];
      p.wow(canvas2.width, canvas2.height);
    }
    //});

    draw.drawPoint(pointsMove, cxt2);
    draw.drawBezierSpline(pointsMove, cxt2);
    draw.drawAuxiliaryLines(pointsMove, cxt2);
  }

  requestAnimationFrame(animate);
}

animate();








},{"./bezier.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/bezier.js","./draw.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/draw.js","./hermite.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/hermite.js","./point.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/point.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/point.js":[function(require,module,exports){
function Point(x,y){
  this.x = x;
  this.y = y;
  this.color = 'green';
  this.threshold = 3 * 3;
  this.dragable = false;
  this.a = Math.random()*6-3;
  this.b = Math.random()*6-3;
}

Point.prototype.isDrag = function(a, b){
  var dis = (this.x - a)*(this.x - a) + (this.y - b)*(this.y - b)
  if(dis < this.threshold){
    this.color = 'red';
    this.dragable = true;
    return true;
  }
  this.color = 'green';
  return false;
}

Point.prototype.set = function(x, y){
  this.x = x;
  this.y = y;
}

Point.prototype.wow = function(w,h){

  this.x += this.a;
  this.y += this.b;

if(this.x < 10 || this.x > w-10) this.a *= -1;
if(this.y < 10 || this.y > h-10) this.b *= -1;
}

module.exports = Point;

function constrain(value, min, max){
  if(value < min) return min;
  if(value > max) return max;
  return value;
}

function map(value, orMin, orMax, dsMin, dsMax){
  var ratio = (value - orMin) / (orMax - orMin);
  return dsMin + (dsMax - dsMin) * ratio;
}
},{}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/vec3.js":[function(require,module,exports){
module.exports = Vec3;

function Vec3(x, y, z){
  return new Float32Array([x || 0, y || 0, z || 0]);
}
},{}]},{},["/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/index.js"]);
