(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/check.js":[function(require,module,exports){
var vid = document.getElementById('videoel');
var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

function enablestart() {
  var startbutton = document.getElementById('startbutton');
  startbutton.value = "start";
  startbutton.disabled = null;
}

document.getElementById('startbutton').onclick = function(){
  startVideo();
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
// check for camerasupport
if (navigator.getUserMedia) {
  // set up stream
  var videoSelector = {video : true};
  if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
    var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    if (chromeVersion < 20) {
      videoSelector = "video";
    }
  };

  navigator.getUserMedia(videoSelector, function( stream ) {
    if (vid.mozCaptureStream) {
      vid.mozSrcObject = stream;
    } else {
      vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }
    vid.play();
  }, function() {
    alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
  });
} else {
  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}
vid.addEventListener('canplay', enablestart, false);

var can = document.getElementById('cover');
var ctx = can.getContext('2d');
exports.eye1 = [0,0];
exports.eye2 = [0,0];
exports.checking = false;

function startVideo() {
  // start video
  vid.play();
  exports.checking = true;
  // start tracking
  ctrack.start(vid);
  // start loop to draw face
  drawLoop();
}

function drawLoop() {
  requestAnimFrame(drawLoop);
  ctx.clearRect(0, 0, 800, 600);
  ctx.drawImage(vid, 0, 0, 800, 600);
  //overlayCC.clearRect(0, 0, 400, 300);
  //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
  if (ctrack.getCurrentPosition()) {
    var positions = ctrack.getCurrentPosition();
    // ctrack.draw(overlay);
    ctx.fillStyle = 'white';
    var a = fromVideoToCanvas(positions[27]);
    ctx.fillRect(a[0], a[1], 10, 10);
    var b = fromVideoToCanvas(positions[32]);
    ctx.fillRect(b[0], b[1], 10, 10);
    exports.eye1 = inverseViewPort(positions[27]);
    exports.eye2 = inverseViewPort(positions[32]);
    console.log(exports.eye1)
  }
}

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
  stats.update();
}, false);


var w = 120;
var h = 90;

function fromVideoToCanvas(p){
  return [p[0]* 800/120, p[1]* 800/120];
}
function inverseViewPort(p){
  var x = p[0] / w * 2 - 1;
  var y = p[1] / h * 2 - 1;
  return [x, y];
}

},{}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/index.js":[function(require,module,exports){
var check  = require('./check.js');
var Mat4 = require('./mat4.js');
var multiply = require('./operate.js').multiply;
var eye1 = check.eye1;
var eye2 = check.eye2;
var checking = check.checking;

canvas1.setup = function() {
  this.addObject(createParametric(24,12,sph), 'norm');
  this.addObject(createParametric(24,12,sph), 'norm');
}

var frameCount = 0;

canvas1.update = function() {
  frameCount++;

   var cy = .5*Math.cos(time);
   var sy = .5*Math.sin(time);
   var theta = frameCount / 10;

   var obj0 = this.objects[0];
   var obj1 = this.objects[1];
   //if(checking){
    //console.log(eye1)
   //}
   //let's do rotation!!!!!
   // var tranM = Mat4.translate(eye1[0], eye1[1], 0);
   // var roM1 = Mat4.rotateX(theta);
   // var roM2 = Mat4.rotateZ(theta);
   // var scM = Mat4.scale(0.2, 0.2, 0.2);

   // var tem = multiply(tranM, roM1);
   // var tem2 = multiply(tem, roM2);
   // var tem3 = multiply(tem2, scM);

   // obj0.matrix = tem3;

   // var tranM2 = Mat4.translate(eye2[0], eye2[1], 0);
   // var tem4 = multiply(tranM2, roM2);
   // var tem5 = multiply(tem4, scM);
   // obj1.matrix = tem5;
   //obj1.matrix = [.4*cy,0,.4*sy,0, 0,.5,0,0, -.4*sy,0,.4*cy,0, 0,0,0,1];

  // obj0.setUniform('p', [.1,.0,0, .9,.0,0, 1,1,1,20]);
   //obj1.setUniform('p', [.1,.1,0, .9,.4,0, 1,1,1,10]);

  // obj0.setUniform('lDir', [.57,.57,.57]);
   //obj1.setUniform('lDir', [.57,.57,.57]);

   if (this.mousePressed)
      console.log("canvas1 drag " + this.mouseX + " " + this.mouseY);
}

var sph = function(u,v) {
   var theta = 2 * Math.PI * u,
       phi = Math.PI * (v - .5),
       cosT = Math.cos(theta) , cosP = Math.cos(phi) ,
       sinT = Math.sin(theta) , sinP = Math.sin(phi) ;
   return [ cosT * cosP, sinT * cosP, sinP ];
}


},{"./check.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/check.js","./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/mat4.js","./operate.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/operate.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/mat4.js":[function(require,module,exports){
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
},{"./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/operate.js":[function(require,module,exports){
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
},{"./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/mat4.js","./vec4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/vec4.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/vec4.js":[function(require,module,exports){
module.exports = Vec4

function Vec4(x, y, z, w) {
  return new Float32Array([x || 0, y || 0, z || 0, w || 0])
}
},{}]},{},["/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/index.js"]);
