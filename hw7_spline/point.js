function Point(x,y){
  this.x = x;
  this.y = y;
  this.color = 'green';
  this.threshold = 3 * 3;
  this.dragable = false;
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

module.exports = Point;