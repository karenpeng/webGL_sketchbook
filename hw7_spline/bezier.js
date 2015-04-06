module.exports = Bezier;

var Vec3 = require('./vec3.js')

function Bezier() {
}

Bezier.getCoord = function (t, points) {
  if (points === undefined || points.length < 3) {
    return;
  }

  if (points.length > 3) {
    var newPoints = [];

    for (var i = 0; i < points.length - 1; i++) {
      newPoints[i] = new Vec3();
      newPoints[i][0] = (1 - t) * points[i][0] + t * points[i + 1][0];
      newPoints[i][1] = (1 - t) * points[i][1] + t * points[i + 1][1];
    }

    return this.getCoord2(t, newPoints);

  } else if (points.length === 3) {
    var S = new Vec3();
    var T = new Vec3();
    S[0] = (1 - t) * points[0][0] + t * points[1][0];
    S[1] = (1 - t) * points[0][1] + t * points[1][1];
    T[0] = (1 - t) * points[1][0] + t * points[2][0];
    T[1] = (1 - t) * points[1][1] + t * points[2][1];
    var point = new Vec3();
    point[0] = (1 - t) * S[0] + t * T[0];
    point[1] = (1 - t) * S[1] + t * T[1];
    return point;
  }
}

Bezier.prototype.getPascal = function(k) {
    var curr = [];

    for (var i = 0; i < k; i++) {
      var next = [];
      for (var j = 0; j <= i; j++) {
        if (j === 0 || j === i) {
          next.push(1);
        } else {
          next.push(curr[j - 1] + curr[j]);
        }
      }
      curr = next;
    }

    return curr;
}