(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/gl.js":[function(require,module,exports){
module.exports = GL;

var multiply = require('./operate.js').multiply;
var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')

function GL(id) {
  this.stack = [];
  this.currentMatrix = Mat4();
  this.eyeMatrix = Mat4();
  this.projectionMatrix = Mat4();
  this.canvas = document.getElementById(id);
  this.context = this.canvas.getContext('2d');
}

GL.prototype.cameraPosition = function (x, y, z) {
  this.eyeMatrix = Mat4.translate(x, y, z)
}

GL.prototype.initCamera = function (fov, aspect, near, far) {
  this.projectionMatrix = Mat4.perspective(fov, aspect, near, far)
}

GL.prototype.popMatrix = function () {
  var element = this.stack.pop();
  if (element === '(') {
    return;
  }
  this.popMatrix();
}

GL.prototype.pushMatrix = function () {
  this.stack.push('(');
}

GL.prototype.multiplyMatrix = function (m) {
  this.stack.push(m);
  this.currentMatrix = Mat4.identity();
  //console.log(this.stack.length)
  for (var i = 0; i < this.stack.length; i++) {
    if (this.stack[i] === '(') continue;
    this.currentMatrix = multiply(this.currentMatrix, this.stack[i]);
  }
}

GL.prototype.reset = function () {
  this.stack = [];
  this.currentMatrix = Mat4();
}

GL.prototype.translate = function (x, y, z) {
  this.multiplyMatrix(Mat4.translate(x, y, z));
}

GL.prototype.rotateX = function (theta) {
  this.multiplyMatrix(Mat4.rotateX(theta));
}

GL.prototype.rotateY = function (theta) {
  this.multiplyMatrix(Mat4.rotateY(theta));
}

GL.prototype.rotateZ = function (theta) {
  this.multiplyMatrix(Mat4.rotateZ(theta));
}

GL.prototype.scale = function (x, y, z) {
  this.multiplyMatrix(Mat4.scale(x, y, z));
}

GL.prototype.transformPoint = function (vec4) {
  //console.log(this.currentMatrix)
  return multiply(this.currentMatrix, vec4)
}

GL.prototype.getEyeCoordinate = function (vec4) {
  return multiply(Mat4.inverse(this.eyeMatrix), vec4)
}

GL.prototype.projectPoint = function (vec4) {
  return multiply(this.projectionMatrix, vec4)
}

GL.prototype.divideW = function (vec4) {
  return Vec4(vec4[0] / vec4[3], vec4[1] / vec4[3], vec4[2] / vec4[3], 1)
}

GL.prototype.viewport = function (vec4) {
  var out = [];
  out[0] = (this.canvas.width / 2) + vec4[0] * (this.canvas.width / 2)
  out[1] = (this.canvas.height / 2) - vec4[1] * (this.canvas.width / 2)
  return out;
}

GL.prototype.drawPoint = function (vec4) {
  var point = this.transformPoint(vec4)
    //console.log(point)
  point = this.getEyeCoordinate(point)

  point = this.projectPoint(point)

  point = this.divideW(point)
    // console.log(point)
  point2D = this.viewport(point)
    //console.log(point2D)
  return point2D
}
},{"./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js","./operate.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/operate.js","./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js":[function(require,module,exports){
module.exports = Mat4;

var Vec4 = require('./vec4.js')

function Mat4(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
  return new Float32Array([
    a00 || 1, a01 || 0, a02 || 0, a03 || 0,
    a10 || 0, a11 || 1, a12 || 0, a13 || 0,
    a20 || 0, a21 || 0, a22 || 1, a23 || 0,
    a30 || 0, a31 || 0, a32 || 0, a33 || 1
  ])
}

Mat4.identity = function () {
  return Mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
}

Mat4.translate = function (x, y, z) {
  return Mat4(
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  )
}

Mat4.scale = function (x, y, z) {
  return Mat4(
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  )
}

Mat4.rotateX = function (theta) {
  return Mat4(
    1, 0, 0, 0,
    0, Math.cos(theta), Math.sin(theta), 0,
    0, -Math.sin(theta), Math.cos(theta), 0,
    0, 0, 0, 1
  )
}

Mat4.rotateY = function (theta) {
  return Mat4(
    Math.cos(theta), 0, -Math.sin(theta), 0,
    0, 1, 0, 0,
    Math.sin(theta), 0, Math.cos(theta), 0,
    0, 0, 0, 1
  )
}

Mat4.rotateZ = function (theta) {
  return Mat4(
    Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
}

Mat4.transform = function (src, dst) {
  //haha this one is tricky:)

}

Mat4.inverse = function (m) {
  var out = Mat4(
    m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10], -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10],
    m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6], -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6],

    -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10],
    m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10], -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6],
    m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6],

    m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9], -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9],
    m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5], -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5],

    -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9],
    m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9], -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5],
    m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5]
  )

  var det = m[0] * out[0] + m[1] * out[4] + m[2] * out[8] + m[3] * out[12]
  for (var i = 0; i < 16; i++) out[i] /= det
  return out

}

// Mat4.perspective = function (fov, aspect, near, far) {
//   var f = 1 / Math.tan(fov / 2),
//     nf = 1 / (near - far)
//   var out = Mat4(
//     f / aspect, 0, 0, 0,
//     0, f, 0, 0,
//     0, 0, (far + near) * nf, -1,
//     0, 0, (2 * far * near) * nf, 0
//   )
//   return out
// }

Mat4.perspective = function (fov, aspect, near, far) {
  var y = Math.tan(fov * Math.PI / 360) * near;
  var x = y * aspect;
  return Mat4.frustum(-x, x, -y, y, near, far);
};

// ### GL.Matrix.frustum(left, right, bottom, top, near, far[, result])
//
// Sets up a viewing frustum, which is shaped like a truncated pyramid with the
// camera where the point of the pyramid would be. You can optionally pass an
// existing matrix in `result` to avoid allocating a new matrix. This emulates
// the OpenGL function `glFrustum()`.
Mat4.frustum = function (l, r, b, t, n, f) {
  return Mat4(
    2 * n / (r - l), 0, (r + l) / (r - l), 0,
    0, 2 * n / (t - b), (t + b) / (t - b), 0,
    0, 0, -(f + n) / (f - n), -2 * f * n / (f - n),
    0, 0, -1, 0
  )

}
},{"./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/noise.js":[function(require,module,exports){
module.exports = Noise;

function Noise() {
  var abs = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = Math.abs(x[i]);
    return dst;
  };
  var add = function (x, y, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] + y[i];
    return dst;
  };
  var dot = function (x, y) {
    var z = 0;
    for (var i = 0; i < x.length; i++)
      z += x[i] * y[i];
    return z;
  };
  var fade = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] * x[i] * x[i] * (x[i] * (x[i] * 6.0 - 15.0) + 10.0);
    return dst;
  };
  var floor = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = Math.floor(x[i]);
    return dst;
  };
  var fract = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] - Math.floor(x[i]);
    return dst;
  };
  var gt0 = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] > 0 ? 1 : 0;
    return dst;
  };
  var lt0 = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] < 0 ? 1 : 0;
    return dst;
  };
  var mix = function (x, y, t, dst) {
    if (!Array.isArray(x))
      return x + (y - x) * t;
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] + (y[i] - x[i]) * t;
    return dst;
  };
  var mod289 = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] - Math.floor(x[i] * (1.0 / 289.0)) * 289.0;
    return dst;
  };
  var multiply = function (x, y, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] * y[i];
    return dst;
  };
  var multiplyScalar = function (x, s) {
    for (var i = 0; i < x.length; i++)
      x[i] *= s;
    return x;
  };
  var permute = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      tmp0[i] = (x[i] * 34.0 + 1.0) * x[i];
    mod289(tmp0, dst);
    return dst;
  };
  var scale = function (x, s, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] * s;
    return dst;
  };
  var set3 = function (a, b, c, dst) {
    dst[0] = a;
    dst[1] = b;
    dst[2] = c;
    return dst;
  }
  var set4 = function (a, b, c, d, dst) {
    dst[0] = a;
    dst[1] = b;
    dst[2] = c;
    dst[3] = d;
    return dst;
  }
  var subtract = function (x, y, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = x[i] - y[i];
    return dst;
  };
  var taylorInvSqrt = function (x, dst) {
    for (var i = 0; i < x.length; i++)
      dst[i] = 1.79284291400159 - 0.85373472095314 * x[i];
    return dst;
  };

  var HALF4 = [.5, .5, .5, .5];
  var ONE3 = [1, 1, 1];
  var f = [0, 0, 0];
  var f0 = [0, 0, 0];
  var f1 = [0, 0, 0];
  var g0 = [0, 0, 0];
  var g1 = [0, 0, 0];
  var g2 = [0, 0, 0];
  var g3 = [0, 0, 0];
  var g4 = [0, 0, 0];
  var g5 = [0, 0, 0];
  var g6 = [0, 0, 0];
  var g7 = [0, 0, 0];
  var gx0 = [0, 0, 0, 0];
  var gy0 = [0, 0, 0, 0];
  var gx1 = [0, 0, 0, 0];
  var gy1 = [0, 0, 0, 0];
  var gz0 = [0, 0, 0, 0];
  var gz1 = [0, 0, 0, 0];
  var i0 = [0, 0, 0];
  var i1 = [0, 0, 0];
  var ix = [0, 0, 0, 0];
  var ixy = [0, 0, 0, 0];
  var ixy0 = [0, 0, 0, 0];
  var ixy1 = [0, 0, 0, 0];
  var iy = [0, 0, 0, 0];
  var iz0 = [0, 0, 0, 0];
  var iz1 = [0, 0, 0, 0];
  var norm0 = [0, 0, 0, 0];
  var norm1 = [0, 0, 0, 0];
  var nz = [0, 0, 0, 0];
  var nz0 = [0, 0, 0, 0];
  var nz1 = [0, 0, 0, 0];
  var tmp0 = [0, 0, 0, 0];
  var tmp1 = [0, 0, 0, 0];
  var tmp2 = [0, 0, 0, 0];
  var sz0 = [0, 0, 0, 0];
  var sz1 = [0, 0, 0, 0];
  var t3 = [0, 0, 0];

  this.noise = function (P) {
    mod289(floor(P, t3), i0);
    mod289(add(i0, ONE3, t3), i1);
    fract(P, f0);
    subtract(f0, ONE3, f1);
    fade(f0, f);

    set4(i0[0], i1[0], i0[0], i1[0], ix);
    set4(i0[1], i0[1], i1[1], i1[1], iy);
    set4(i0[2], i0[2], i0[2], i0[2], iz0);
    set4(i1[2], i1[2], i1[2], i1[2], iz1);

    permute(add(permute(ix, tmp1), iy, tmp2), ixy);
    permute(add(ixy, iz0, tmp1), ixy0);
    permute(add(ixy, iz1, tmp1), ixy1);

    scale(ixy0, 1 / 7, gx0);
    scale(ixy1, 1 / 7, gx1);
    subtract(fract(scale(floor(gx0, tmp1), 1 / 7, tmp2), tmp0), HALF4, gy0);
    subtract(fract(scale(floor(gx1, tmp1), 1 / 7, tmp2), tmp0), HALF4, gy1);
    fract(gx0, gx0);
    fract(gx1, gx1);
    subtract(subtract(HALF4, abs(gx0, tmp1), tmp2), abs(gy0, tmp0), gz0);
    subtract(subtract(HALF4, abs(gx1, tmp1), tmp2), abs(gy1, tmp0), gz1);
    gt0(gz0, sz0);
    gt0(gz1, sz1);

    subtract(gx0, multiply(sz0, subtract(lt0(gx0, tmp1), HALF4, tmp2), tmp0), gx0);
    subtract(gy0, multiply(sz0, subtract(lt0(gy0, tmp1), HALF4, tmp2), tmp0), gy0);
    subtract(gx1, multiply(sz1, subtract(lt0(gx1, tmp1), HALF4, tmp2), tmp0), gx1);
    subtract(gy1, multiply(sz1, subtract(lt0(gy1, tmp1), HALF4, tmp2), tmp0), gy1);

    set3(gx0[0], gy0[0], gz0[0], g0);
    set3(gx0[1], gy0[1], gz0[1], g1);
    set3(gx0[2], gy0[2], gz0[2], g2);
    set3(gx0[3], gy0[3], gz0[3], g3);
    set3(gx1[0], gy1[0], gz1[0], g4);
    set3(gx1[1], gy1[1], gz1[1], g5);
    set3(gx1[2], gy1[2], gz1[2], g6);
    set3(gx1[3], gy1[3], gz1[3], g7);

    taylorInvSqrt(set4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3), tmp0), norm0);
    taylorInvSqrt(set4(dot(g4, g4), dot(g5, g5), dot(g6, g6), dot(g7, g7), tmp0), norm1);

    multiplyScalar(g0, norm0[0]);
    multiplyScalar(g1, norm0[1]);
    multiplyScalar(g2, norm0[2]);
    multiplyScalar(g3, norm0[3]);

    multiplyScalar(g4, norm1[0]);
    multiplyScalar(g5, norm1[1]);
    multiplyScalar(g6, norm1[2]);
    multiplyScalar(g7, norm1[3]);

    mix(set4(g0[0] * f0[0] + g0[1] * f0[1] + g0[2] * f0[2],
        g1[0] * f1[0] + g1[1] * f0[1] + g1[2] * f0[2],
        g2[0] * f0[0] + g2[1] * f1[1] + g2[2] * f0[2],
        g3[0] * f1[0] + g3[1] * f1[1] + g3[2] * f0[2], tmp1),

      set4(g4[0] * f0[0] + g4[1] * f0[1] + g4[2] * f1[2],
        g5[0] * f1[0] + g5[1] * f0[1] + g5[2] * f1[2],
        g6[0] * f0[0] + g6[1] * f1[1] + g6[2] * f1[2],
        g7[0] * f1[0] + g7[1] * f1[1] + g7[2] * f1[2], tmp2), f[2], nz);

    return 2.2 * mix(mix(nz[0], nz[2], f[1]), mix(nz[1], nz[3], f[1]), f[0]);
  };
};
},{}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/operate.js":[function(require,module,exports){
var Vec4 = require('./vec4.js')
var Mat4 = require('./mat4.js')

module.exports.multiply = multiply
module.exports.dot = dot

function multiply(mat4, something) {
  //console.log(something)
  if (something[4] !== undefined) {
    //something is a matrix
    //console.log('!')
    var aMat4 = mat4;
    var bMat4 = something;
    var out = Mat4(
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[0], aMat4[1], aMat4[2], aMat4[3]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15])),

      dot(Vec4(aMat4[4], aMat4[5], aMat4[6], aMat4[7]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[4], aMat4[5], aMat4[6], aMat4[7]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[4], aMat4[5], aMat4[6], aMat4[7]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[4], aMat4[5], aMat4[7], aMat4[7]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15])),

      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[8], aMat4[9], aMat4[10], aMat4[11]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15])),

      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[0], bMat4[4], bMat4[8], bMat4[12])),
      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[1], bMat4[5], bMat4[9], bMat4[13])),
      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[2], bMat4[6], bMat4[10], bMat4[14])),
      dot(Vec4(aMat4[12], aMat4[13], aMat4[14], aMat4[15]), Vec4(bMat4[3], bMat4[7], bMat4[11], bMat4[15]))
    )
    return out;

  } else {
    //something is a vec4
    var vec4 = something;
    var out = Vec4(
        dot(Vec4(mat4[0], mat4[1], mat4[2], mat4[3]), vec4),
        dot(Vec4(mat4[4], mat4[5], mat4[6], mat4[7]), vec4),
        dot(Vec4(mat4[8], mat4[9], mat4[10], mat4[11]), vec4),
        dot(Vec4(mat4[12], mat4[13], mat4[14], mat4[15]), vec4)
      )
      //console.log(out)
    return out

  }

}

function dot(aVec4, something) {
  if (something[3] !== undefined) {
    //something is a vec4
    var bVec4 = something
    return aVec4[0] * bVec4[0] + aVec4[1] * bVec4[1] + aVec4[2] * bVec4[2] + aVec4[3] * bVec4[3]

  } else {
    //something is a value
    return aVec4[0] * something + aVec4[1] * something + aVec4[2] * something + aVec4[3] * something
  }
}
},{"./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js","./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/quickmain2.js":[function(require,module,exports){
var Mat4 = require('./mat4.js')
var Vec4 = require('./vec4.js')
var operate = require('./operate.js')
var GL = require('./gl.js')
var Noise = require('./noise.js')
var N = new Noise();

canvas = document.getElementById('canvas1')
context = canvas.getContext('2d')
w = canvas.width
h = canvas.height

DISTANCE_FROM_CAMERA_TO_ZERO = 6
FOV = 45
ASPECT = w / h
NEAR = 1
FAR = 2200

var gl;

function init() {
  gl = new GL('canvas1');
  gl.initCamera(FOV, ASPECT, NEAR, FAR);
  gl.cameraPosition(0, 0, DISTANCE_FROM_CAMERA_TO_ZERO)

}

// var instruction = document.createElement('p');
// instruction.innerHTML = 'Keep Press mouse down to see the tree';
// instruction.setAttribute('id', 'instruction');
// document.body.appendChild(instruction);

var a = 0,
  b = 0;

window.onmousemove = function (e) {
  a = (e.pageX - w / 2) / (w / 2)
  b = (e.pageY - h / 2) / (w / 2)
}

function render() {
  context.fillStyle = 'black';
  context.clearRect(0, 0, canvas.width, canvas.height)

  var time = Date.now() * 0.001

  gl.reset();

  gl.rotateX(a)
  gl.rotateY(b)

  gl.rotateY(time / 10);
  gl.translate(0, -2, 0);

  gl.pushMatrix();
  branch(1, time / 10);
  gl.popMatrix();
}

var points = []

var mousedown = false;

window.onmousedown = function () {
  mousedown = true;
  //branch();
}
window.onmouseup = function () {
  mousedown = false;
}

function branch(len, time) {
  //gl.translate(0, -l, 0);
  var p1 = gl.drawPoint([0, 0, 0, 1]);
  var p2 = gl.drawPoint([0, len, 0, 1]);
  // console.log(p1[0], p1[1]);
  // console.log(p2[0], p1[1]);
  lineBetweenTwoPoints(p1, p2);
  gl.translate(0, len, 0);

  len *= 0.7;
  //l += Math.random() * 0.1 - 0.05;

  if (len > 0.05) {
    //console.log('left')
    gl.pushMatrix();
    var ran = Math.round(N.noise(len, time));
    ran = Math.round(Math.sin(len * 50));
    var theta = N.noise(len, time);
    theta = Math.PI / 6;
    switch (ran) {
    case 0:
      gl.rotateZ(theta);
      break;
    case 1:
      gl.rotateX(theta);
      break;
    case -1:
      gl.rotateY(theta);
      break;
    }
    branch(len);
    gl.popMatrix();

    //console.log('right')
    gl.pushMatrix();
    var ran = Math.round(N.noise(len, time));
    ran = Math.round(Math.sin(len * 100));
    var theta = N.noise(len, time);
    theta = -Math.PI / 6;
    switch (ran) {
    case 0:
      gl.rotateZ(theta);
      break;
    case 1:
      gl.rotateX(theta);
      break;
    case -1:
      gl.rotateY(theta);
      break;
    }
    branch(len);
    gl.popMatrix();

  }
}

function lineBetweenTwoPoints(p1, p2) {
  //console.log(gl)
  gl.context.beginPath();
  gl.context.strokeStyle = 'white';
  gl.context.moveTo(p1[0], p1[1]);
  gl.context.lineTo(p2[0], p2[1]);
  gl.context.stroke();
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

init()
render()
animate()
},{"./gl.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/gl.js","./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/mat4.js","./noise.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/noise.js","./operate.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/operate.js","./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/vec4.js":[function(require,module,exports){
module.exports = Vec4

function Vec4(x, y, z, w) {
  return new Float32Array([x || 0, y || 0, z || 0, w || 0])
}
},{}]},{},["/Users/karen/Documents/my_project/webGL_sketch/hw5_matrix/quickmain2.js"]);
