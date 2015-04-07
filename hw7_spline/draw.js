var Bezier = require('./bezier.js');
var Hermite = require('./hermite.js');
var Vec3 = require('./vec3.js');

var canvas = document.getElementById('canvas1');
var g = canvas.getContext('2d');

exports.drawBezierSpline = function (points) {
  var num = points.length;

  if (num < 3) {
    return;
  }

  var ut = 1.0 / (num * 20);
  var res = [];

  for (var t = 0; t < .999; t += ut) {
    res.push(Bezier.getCoord(t, points));
  }

  exports.drawSpline(res);
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

exports.drawSpline = function (vertices) {

  for (var i = 0; i < vertices.length - 1; i++) {
    // var vertex1 = new Vec3(0, 0, 0);
    // var vertex2 = new Vec3(0, 0, 0);
    // transform(vertices[i], vertex1);
    // transform(vertices[i + 1], vertex2);
    // var p1 = viewport(vertex1, canvas);
    // var p2 = viewport(vertex2, canvas);
    var p1 = vertices[i];
    var p2 = vertices[i+1];
    g.strokeStyle = 'black';
    g.beginPath();
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.stroke();
  }
};

var radius = 6;

exports.drawPoint = function(points){
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    //var vertex = new Vec3(0, 0, 0);
    //transform(point, vertex);
    //var p = viewport(vertex, canvas);

    g.beginPath();
    // g.arc(p[0], p[1], radius, 0, 2 * Math.PI, false);
    g.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    g.fillStyle = point.color;
    g.fill();
    g.lineWidth = 1;
    g.strokeStyle = '#003300';
    g.stroke();
  }
}

exports.drawAuxiliaryLines = function (points) {

  var defaultLineDash = g.getLineDash();
  g.setLineDash([2]);
  g.strokeStyle = 'gray';

  for (var i = 0; i < points.length - 1; i++) {
    // var vertex1 = Vec3(0, 0, 0);
    // var vertex2 = Vec3(0, 0, 0);
    // transform(points[i], vertex1);
    // transform(points[i + 1], vertex2);
    // var p1 = viewport(vertex1, canvas);
    // var p2 = viewport(vertex2, canvas);
    var p1 = points[i];
    var p2 = points[i+1];
    g.beginPath();
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.stroke();
  }

  g.setLineDash(defaultLineDash);
}

function transform(src, dst) {
  w = this.matrix[8] * src[0] + this.matrix[9] * src[1] + this.matrix[10] * src[2] + this.matrix[11];
  dst[0] = (this.matrix[0] * src[0] + this.matrix[1] * src[1] + this.matrix[2] * src[2] + this.matrix[3]) / w;
  dst[1] = (this.matrix[4] * src[0] + this.matrix[5] * src[1] + this.matrix[6] * src[2] + this.matrix[7]) / w;
  dst[2] = (this.matrix[8] * src[0] + this.matrix[9] * src[1] + this.matrix[10] * src[2] + this.matrix[11]) / w;
}

function viewport(p, can){
  var x = (can.width / 2) + p[0] * (can.width / 2);
  var y =  -(p[1] - (can.height / 2)) / (can.width / 2);
  return [x, y];
}