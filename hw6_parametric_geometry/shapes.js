var Noise = require('./noise.js')
var N = new Noise()
  // var noise = new Noise().noise
  //console.log(Noise)

module.exports = {
  pointOnCylinder: function (uv) {
    var u = uv[0];
    var v = uv[1];
    var theta = 2 * Math.PI * u;
    var x = Math.sin(theta);
    var y = 2 * v - 1;
    var z = Math.cos(theta);
    return [x, y, z];
  },

  pointOnBlanket: function (uv, time) {
    var u = uv[0];
    var v = uv[1];
    var p = N.noise([u, v, 0])
    var theta = 2 * Math.PI * u;
    var x = Math.sin(theta);
    var y = 2 * v - 1 + N.noise([p, time / 10, 0]);
    var z = Math.cos(theta) + Math.sin(p + time / 10);

    if (v <= 0.25) {
      r = 4 * v;
      z = -1;
    }

    // TUBE
    else if (v < 0.75) {
      z = (v - 0.25) * 4 - 1;
    }

    // FRONT
    else {
      r = 1 - (v - .75) * 4;
      z = 1;
    }
    return [x, y, z];
  },

  pointOnFlag: function(uv, time){
    var u = uv[0]
    var v = uv[1]
    var p = N.noise([u - time, v, time]) * u
    //var p = Math.sin(u * v * 10 - time * 2) * u
    var x = u
    var y = v
    var z = p
    return [x, y, z]
  },

  pointOnWow: function(uv, time){
    var u = uv[0]
    var v = uv[1]
    //var p = N.noise([u - time, v, time]) * u
    var p = Math.sin(u * v * 10 - time * 3)
    var x = u
    var y = v
    var z = p
    return [x, y, z]
  },

  pointOnSphere: function (uv) {
    var u = uv[0];
    var v = uv[1];
    var theta = 2 * Math.PI * u;
    var phi = Math.PI * v - Math.PI / 2;
    var x = Math.cos(phi) * Math.sin(theta);
    var y = Math.sin(phi);
    var z = Math.cos(phi) * Math.cos(theta);
    return [x, y, z];
  },

  pointOnBagel: function (uv, r) {
    r = r || 0.2;
    var theta = 2 * Math.PI * uv[0];
    var phi = 2 * Math.PI * uv[1];
    var x = (1 + r * Math.cos(phi)) * Math.cos(theta);
    var y = (1 + r * Math.cos(phi)) * Math.sin(theta);
    var z = r * Math.sin(phi);
    return [x, y, z];
  },

  blob: function (uv, time) {
    var u = uv[0];
    var v = uv[1];

    // var detail = 5.;
    // var detail2 = 2.;
    // var detail3 = 9.;
    var p = N.noise([u, v, 0])
      //console.log(p)

    var p1 = N.noise([p, time / 10, 0])

    var p2 = N.noise([p1, 0, time])
      // var p2 = noise(p1 + time)

    var theta = 2 * Math.PI * u;
    var phi = Math.PI * v - Math.PI / 2;
    var x = Math.cos(phi) * Math.sin(theta) + p;
    var y = Math.sin(phi) + p1;
    var z = Math.cos(phi) * Math.cos(theta) + p2;
    return [x, y, z];
  },

  blob1: function (uv, time) {
    var u = uv[0];
    var v = uv[1];
    var p = N.noise([u, v, 0])

    var p1 = N.noise([p, time / 10, 0])

    var p2 = N.noise([p1, 0, time])

    var theta = 2 * Math.PI * u;
    var x = Math.sin(theta);
    var y = 2 * v - 1 + Math.cos(p + time);
    var z = Math.cos(theta);
    return [x, y, z];
  }
}