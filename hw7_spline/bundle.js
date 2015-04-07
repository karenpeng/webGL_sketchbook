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
 for(var i = 0; i < 10; i++){
    pointsMove.push(new Point(
      Math.random()*(canvas2.width-20)+10,
      Math.random()*(canvas2.height-20)+10
    ));
  }
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

    pointsMove.forEach(function(p){
      p.wow(canvas2.width, canvas2.height);
    });

    draw.drawPoint(pointsMove, cxt2);
    draw.drawBezierSpline(pointsMove, cxt2);
    draw.drawAuxiliaryLines(pointsMove, cxt2);
  }

  requestAnimationFrame(animate);
}

animate();








},{"./bezier.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/bezier.js","./draw.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/draw.js","./hermite.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/hermite.js","./point.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/point.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/noise.js":[function(require,module,exports){
module.exports = Noise;

function Noise() {
  var abs = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = Math.abs(x[i]);
    return dst;
  };
  var add = function (x, y, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] + y[i];
    return dst;
  };
  var dot = function (x, y) {
    var z = 0;
    for (var i = 0; i < x.length; i++)
      z += x[i] * y[i];
    return z;
  };
  var fade = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] * x[i] * x[i] * (x[i] * (x[i] * 6.0 - 15.0) + 10.0);
    return dst;
  };
  var floor = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = Math.floor(x[i]);
    return dst;
  };
  var fract = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] - Math.floor(x[i]);
    return dst;
  };
  var gt0 = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] > 0 ? 1 : 0;
    return dst;
  };
  var lt0 = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] < 0 ? 1 : 0;
    return dst;
  };
  var mix = function (x, y, t, dst) {
    if (!Array.isArray(x))
      return x + (y - x) * t;
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] + (y[i] - x[i]) * t;
    return dst;
  };
  var mod289 = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] - Math.floor(x[i] * (1.0 / 289.0)) * 289.0;
    return dst;
  };
  var multiply = function (x, y, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] * y[i];
    return dst;
  };
  var multiplyScalar = function (x, s) {
    for (var i = 0; i < x.length; i++)
      x[i] *= s;
    return x;
  };
  var permute = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      tmp0[i] = (x[i] * 34.0 + 1.0) * x[i];
    mod289(tmp0, dst);
    return dst;
  };
  var scale = function (x, s, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] * s;
    return dst;
  };
  var set3 = function (a, b, c, dst) {
    dst[0] = a;
    dst[1] = b;
    dst[2] = c;
    return dst;
  }
  var set4 = function (a, b, c, d, dst) {
    dst[0] = a;
    dst[1] = b;
    dst[2] = c;
    dst[3] = d;
    return dst;
  }
  var subtract = function (x, y, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] - y[i];
    return dst;
  };
  var taylorInvSqrt = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = 1.79284291400159 - 0.85373472095314 * x[i];
    return dst;
  };

  var HALF4 = [.5, .5, .5, .5];
  var ONE3 = [1, 1, 1];
  var f = [0, 0, 0];
  var f0 = [0, 0, 0];
  var f1 = [0, 0, 0];
  var g0 = [0, 0, 0];
  var g1 = [0, 0, 0];
  var g2 = [0, 0, 0];
  var g3 = [0, 0, 0];
  var g4 = [0, 0, 0];
  var g5 = [0, 0, 0];
  var g6 = [0, 0, 0];
  var g7 = [0, 0, 0];
  var gx0 = [0, 0, 0, 0];
  var gy0 = [0, 0, 0, 0];
  var gx1 = [0, 0, 0, 0];
  var gy1 = [0, 0, 0, 0];
  var gz0 = [0, 0, 0, 0];
  var gz1 = [0, 0, 0, 0];
  var i0 = [0, 0, 0];
  var i1 = [0, 0, 0];
  var ix = [0, 0, 0, 0];
  var ixy = [0, 0, 0, 0];
  var ixy0 = [0, 0, 0, 0];
  var ixy1 = [0, 0, 0, 0];
  var iy = [0, 0, 0, 0];
  var iz0 = [0, 0, 0, 0];
  var iz1 = [0, 0, 0, 0];
  var norm0 = [0, 0, 0, 0];
  var norm1 = [0, 0, 0, 0];
  var nz = [0, 0, 0, 0];
  var nz0 = [0, 0, 0, 0];
  var nz1 = [0, 0, 0, 0];
  var tmp0 = [0, 0, 0, 0];
  var tmp1 = [0, 0, 0, 0];
  var tmp2 = [0, 0, 0, 0];
  var sz0 = [0, 0, 0, 0];
  var sz1 = [0, 0, 0, 0];
  var t3 = [0, 0, 0];

  this.noise = function (P) {
    mod289(floor(P, t3), i0);
    mod289(add(i0, ONE3, t3), i1);
    fract(P, f0);
    subtract(f0, ONE3, f1);
    fade(f0, f);

    set4(i0[0], i1[0], i0[0], i1[0], ix);
    set4(i0[1], i0[1], i1[1], i1[1], iy);
    set4(i0[2], i0[2], i0[2], i0[2], iz0);
    set4(i1[2], i1[2], i1[2], i1[2], iz1);

    permute(add(permute(ix, tmp1), iy, tmp2), ixy);
    permute(add(ixy, iz0, tmp1), ixy0);
    permute(add(ixy, iz1, tmp1), ixy1);

    scale(ixy0, 1 / 7, gx0);
    scale(ixy1, 1 / 7, gx1);
    subtract(fract(scale(floor(gx0, tmp1), 1 / 7, tmp2), tmp0), HALF4, gy0);
    subtract(fract(scale(floor(gx1, tmp1), 1 / 7, tmp2), tmp0), HALF4, gy1);
    fract(gx0, gx0);
    fract(gx1, gx1);
    subtract(subtract(HALF4, abs(gx0, tmp1), tmp2), abs(gy0, tmp0), gz0);
    subtract(subtract(HALF4, abs(gx1, tmp1), tmp2), abs(gy1, tmp0), gz1);
    gt0(gz0, sz0);
    gt0(gz1, sz1);

    subtract(gx0, multiply(sz0, subtract(lt0(gx0, tmp1), HALF4, tmp2), tmp0), gx0);
    subtract(gy0, multiply(sz0, subtract(lt0(gy0, tmp1), HALF4, tmp2), tmp0), gy0);
    subtract(gx1, multiply(sz1, subtract(lt0(gx1, tmp1), HALF4, tmp2), tmp0), gx1);
    subtract(gy1, multiply(sz1, subtract(lt0(gy1, tmp1), HALF4, tmp2), tmp0), gy1);

    set3(gx0[0], gy0[0], gz0[0], g0);
    set3(gx0[1], gy0[1], gz0[1], g1);
    set3(gx0[2], gy0[2], gz0[2], g2);
    set3(gx0[3], gy0[3], gz0[3], g3);
    set3(gx1[0], gy1[0], gz1[0], g4);
    set3(gx1[1], gy1[1], gz1[1], g5);
    set3(gx1[2], gy1[2], gz1[2], g6);
    set3(gx1[3], gy1[3], gz1[3], g7);

    taylorInvSqrt(set4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3), tmp0), norm0);
    taylorInvSqrt(set4(dot(g4, g4), dot(g5, g5), dot(g6, g6), dot(g7, g7), tmp0), norm1);

    multiplyScalar(g0, norm0[0]);
    multiplyScalar(g1, norm0[1]);
    multiplyScalar(g2, norm0[2]);
    multiplyScalar(g3, norm0[3]);

    multiplyScalar(g4, norm1[0]);
    multiplyScalar(g5, norm1[1]);
    multiplyScalar(g6, norm1[2]);
    multiplyScalar(g7, norm1[3]);

    mix(set4(g0[0] * f0[0] + g0[1] * f0[1] + g0[2] * f0[2],
        g1[0] * f1[0] + g1[1] * f0[1] + g1[2] * f0[2],
        g2[0] * f0[0] + g2[1] * f1[1] + g2[2] * f0[2],
        g3[0] * f1[0] + g3[1] * f1[1] + g3[2] * f0[2], tmp1),

      set4(g4[0] * f0[0] + g4[1] * f0[1] + g4[2] * f1[2],
        g5[0] * f1[0] + g5[1] * f0[1] + g5[2] * f1[2],
        g6[0] * f0[0] + g6[1] * f1[1] + g6[2] * f1[2],
        g7[0] * f1[0] + g7[1] * f1[1] + g7[2] * f1[2], tmp2), f[2], nz);

    return 2.2 * mix(mix(nz[0], nz[2], f[1]), mix(nz[1], nz[3], f[1]), f[0]);
  };
};
},{}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/point.js":[function(require,module,exports){
var Noise = require('./noise.js');
var N = new Noise();

function Point(x,y){
  this.x = x;
  this.y = y;
  this.color = 'green';
  this.threshold = 3 * 3;
  this.dragable = false;
  this.a = Math.random()*10;
  this.b = Math.random()*10;
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
  var lerpX = map(N.noise([this.a, this.b, 0]), 0, 1, -5, 6);
  var lerpY = map(N.noise([this.b, this.a, 0]), 0, 1, -5, 6);
  console.log(lerpX)
  this.x += lerpX;
  this.y += lerpY;
  this.a += 0.006;
  this.b += 0.006;

  this.x = constrain(this.x, 10, w -10);
  this.y = constrain(this.y, 10, h -10);
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
},{"./noise.js":"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/noise.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/vec3.js":[function(require,module,exports){
module.exports = Vec3;

function Vec3(x, y, z){
  return new Float32Array([x || 0, y || 0, z || 0]);
}
},{}]},{},["/Users/karen/Documents/my_project/webGL_sketch/hw7_spline/index.js"]);
