var Noise = require('./noise.js')
var N = new Noise()

module.exports = {

  renderTriangle: function (tri, gl, color, text) {

    var a = gl.drawPoint(tri[0].concat(1));
    var b = gl.drawPoint(tri[1].concat(1));
    var c = gl.drawPoint(tri[2].concat(1));
    //console.log(gl)
    //console.log(a)

    // IF THE TRIANGLE IS BACKWARD FACING, DON'T RENDER IT.
    var area = this.computeArea([a, b, c]);
    if (area <= 0)
      return;

    this.drawCurve([a, b, c, a], gl, color, text);
  },
  // DRAW A CURVE ON THE 2D CANVAS.
  drawCurve: function (C, gl, color, text) {
    //console.log(gl)
    //gl.context.beginPath();
    //console.log(color)
    gl.context.font = "20px Georgia";
    for (var i = 0; i < C.length; i++) {
      if (i == 0) {
        switch (color) {
        case undefined:
          var r = Math.floor(128 + 127 * Math.cos(C[i][0]));
          var g = Math.floor(128 + 127 * Math.sin(C[i][1]));
          var b = Math.floor(255)
          gl.context.strokeStyle = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')'
          gl.context.fillStyle = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')'
          break;
          // case 'red':
          //   var p = N.noise([C[i][0], 0, 0]);
          //   var p2 = N.noise([C[i][1], 0, 0])
          //     //console.log(p);
          //   var g = Math.floor(128 + 127 * p);
          //   var b = Math.floor(128 + 127 * p2);
          //   //g.strokeStyle = 'rgb(50,200,' + val.toString() + ')';
          //   gl.context.strokeStyle = 'rgb(255,' + g.toString() + ',' + b.toString() + '50,0)'
          //     //console.log(color)
          //   break;
        default:
          gl.context.strokeStyle = color;
          gl.context.fillStyle = color;
          break
        }
        //gl.context.moveTo(C[i][0], C[i][1]);
        gl.context.fillText(text, C[i][0], C[i][1])
      } else {
        //console.log(C[i])
        //gl.context.lineTo(C[i][0], C[i][1]);
        gl.context.fillText(text, C[i][0], C[i][1])
      }
    }
    //gl.context.stroke();
  },

  computeArea: function (P) {
    var area = 0;
    for (var i = 0; i < P.length; i++) {
      var j = (i + 1) % P.length;
      var a = P[i];
      var b = P[j];
      area += (a[0] - b[0]) * (a[1] + b[1]);
    }
    return area / 2;
  },

  // subdivide: function (tri, nLevels) {
  //   var a = tri[0];
  //   var b = tri[1];
  //   var c = tri[2];

  //   if (--nLevels == 0) {
  //     this.renderTriangle([this.inflate(a), this.inflate(b), this.inflate(c)]);
  //     return;
  //   }

  //   var d = this.midpoint(a, b);
  //   var e = this.midpoint(b, c);
  //   var f = this.midpoint(c, a);

  //   this.subdivide([a, d, f], nLevels);
  //   this.subdivide([b, d, e], nLevels);
  //   this.subdivide([c, e, f], nLevels);
  //   this.subdivide([d, e, f], nLevels);
  // },
  //    // INFLATE THE SHAPE.
  //  inflate: function (p) {
  //    var x = p[0],
  //      y = p[1],
  //      z = p[2];
  //    var r = Math.sqrt(x * x + y * y + z * z);
  //    return [p[0] / r, p[1] / r, p[2] / r];
  //  },

  //  midpoint: function(a,b){
  //   return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  //  }

  renderFaces: function (faces, gl, color, text) {
    //console.log(faces)
    for (var i = 0; i < faces.length; i++) {
      this.renderTriangle(faces[i], gl, color, text);
    }
  },

  renderObject: function (nu, nv, func, gl, color, time, text) {
    var vertices = [];
    for (var i = 0; i <= nu; i++) {
      vertices.push([]);
      for (var j = 0; j <= nv; j++) {
        vertices[i].push(func([i / nu, j / nv], time));
        //console.log(time)
      }
    }
    //instead of render vertices. we have uv mesh so now, we should make faces(triangles) to be sent to render triangles
    var faces = [];
    for (var i = 0; i < nu; i += 1) {
      for (var j = 0; j < nv; j += 1) {
        var a = vertices[i][j];
        var b = vertices[i][j + 1];
        var c = vertices[i + 1][j];
        var d = vertices[i + 1][j + 1];

        faces.push([a, d, c]);
        faces.push([a, b, d]);
      }
    }
    //console.log(faces)
    //console.log(this)
    this.renderFaces(faces, gl, color, text);
  }

}