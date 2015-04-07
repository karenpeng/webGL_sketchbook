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