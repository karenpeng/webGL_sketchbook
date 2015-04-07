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
  this.a += 0.01;
  this.b += 0.01;

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