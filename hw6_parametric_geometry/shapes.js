var Noise = require('./noise.js')
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
    var N = new Noise()

    // var detail = 5.;
    // var detail2 = 2.;
    // var detail3 = 9.;
    var p = N.noise([u, v, 0])
    //console.log(p)

     var p1 = N.noise([p , time / 10, 0])

     var p2 = N.noise([p1, 0, time])
    // var p2 = noise(p1 + time)

    var theta = 2 * Math.PI * u;
    var phi = Math.PI * v - Math.PI / 2;
    var x = Math.cos(phi) * Math.sin(theta) + p;
    var y = Math.sin(phi) + p1;
    var z = Math.cos(phi) * Math.cos(theta) + p2;
    return [x, y, z];
  }
}