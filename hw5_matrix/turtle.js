function Turtle(s, l, t) {
  this.todo = s;
  this.len = l;
  this.theta = t;
}

Turtle.prototype.render = function (gl) {
  //console.log('oh')
  for (var i = 0; i < this.todo.length; i++) {
    var c = this.todo[i];
    //console.log(c);
    if (c === 'F' || c === 'G') {
      var p1 = gl.drawPoint([0, 0, 0, 1]);
      var p2 = gl.drawPoint([this.len, 0, 0, 1]);
      //console.log(p1);
      lineBetweenTwoPoints(p1, p2, gl);
      gl.translate(this.len, 0);
    } else if (c === '+') {
      gl.rotateZ(this.theta);
    } else if (c === '-') {
      gl.rotateZ(-this.theta);
    } else if (c === '[') {
      gl.pushMatrix();
    } else if (c === ']') {
      gl.popMatrix();
    }
  }
}

Turtle.prototype.setLen = function (l) {
  this.len = l;
}

Turtle.prototype.changeLen = function (percent) {
  this.len *= percent;
}

Turtle.prototype.setToDo = function (s) {
  this.todo = s;
}

function lineBetweenTwoPoints(p1, p2, gl) {
  //console.log(gl)
  gl.context.beginPath();
  gl.context.strokeStyle = 'white';
  gl.context.moveTo(p1[0], p1[1]);
  gl.context.lineTo(p2[0], p2[1]);
  gl.context.stroke();
}

module.exports = Turtle;

//TO DO: setter