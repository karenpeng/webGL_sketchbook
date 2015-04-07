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







