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