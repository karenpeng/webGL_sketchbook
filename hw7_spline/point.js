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