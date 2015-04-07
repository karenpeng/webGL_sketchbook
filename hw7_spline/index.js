var Bezier = require('./bezier.js');
var Hermite = require('./hermite.js');
var Vec3 = require('./vec3.js');
var draw = require('./draw.js');
var Point = require('./point.js');

var canvas = document.getElementById('canvas1');
var cxt = canvas.getContext('2d');

// var canvas = document.getElementById('canvas1');
// var g = canvas.getContext('2d');

var points = [];
points.push(new Point(10,10));
points.push(new Point(canvas.width - 10, canvas.height - 10));
var mouseIsDown = false;
var mouseIsOnPoint = false;

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
  var hit = 0;
  if(points.length >= 3){
    for(var i = 1; i< points.length - 1; i++){
      if(points[i].isDrag(e.pageX, e.pageY)){
        hit ++;
        break;
      }
    }
    mouseIsOnPoint = hit > 0 ? true : false;
  }


  if(mouseIsDown){
    points.forEach(function(p){
      if(p.dragable){
        console.log('hello?')
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
    draw.drawPoint(points);
    draw.drawBezierSpline(points);
    draw.drawAuxiliaryLines(points);
  }
  //mouseDetect();
  //console.log(mouseIsOnPoint)
  requestAnimationFrame(animate);
}

animate();