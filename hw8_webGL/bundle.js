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
    //console.log(exports.eye1)
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

},{}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/gl.js":[function(require,module,exports){

// SIMPLE DEFAULT VERTEX SHADER, WHICH PROVIDES:
//    TRANSFORMED POSITION:   gl_Position
//    TRANSFORMED NORMAL:     vNormal
//    UNTRANSFORMED POSITION: vXYZ
//    TEXTURE PARAMETERS:     vUV

/*hey hey the 4th dimension is added in here*/
   var vertexShaderStr = "\
   attribute vec3 aVertexPosition;\
   attribute vec3 aVertexNormal;\
   attribute vec2 aVertexUV;\
   uniform mat4 uPMatrix; /* perspective matrix */\
   uniform mat4 uOMatrix; /* object matrix */\
   uniform mat4 uNMatrix; /* normal matrix */\
   varying vec3 vNormal;\
   varying vec3 vXYZ;\
   varying vec2 vUV;\
   void main(void) {\
      gl_Position = uPMatrix * uOMatrix * vec4(aVertexPosition, 1.0);\
      vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);\
      vXYZ = aVertexPosition;\
      vUV = aVertexUV;\
   }"

// FUNCTION TO RETURN THE IDENTITY MATRIX:

   function identity() { return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; }

// FUNCTION TO RETURN A PERSPECTIVE TRANSFORM, SIMULATING A CAMERA AT Z = fl:

   function perspective(fl) { return [1,0,0,0, 0,1,0,0, 0,0,-1/fl,-1/fl, 0,0,0,1]; }

// KEEP AN ARRAY OF ALL THE WEBGL CANVASES IN THE DOC:

   var glCanvases = [];

// KEEP TRACK OF STARTING TIME AND CURRENT TIME:

   var startTime = 0.0;
   var time = 0.0;

// GIVEN A MATRIX THAT TRANSFORMS POINTS, COMPUTE ITS INVERSE TRANSPOSE,
// WITHOUT TRANSLATION, TO TRANSFORM THE CORRESPONDING SURFACE NORMAL:

   function normalMatrix(m){
      var sx = m[0] * m[0] + m[1] * m[1] + m[ 2] * m[ 2];
      var sy = m[4] * m[4] + m[5] * m[5] + m[ 6] * m[ 6];
      var sz = m[8] * m[8] + m[9] * m[9] + m[10] * m[10];

      return [ m[0]/sx, m[1]/sx, m[ 2]/sx, 0,
               m[4]/sy, m[5]/sy, m[ 6]/sy, 0,
               m[8]/sz, m[9]/sz, m[10]/sz, 0,  0,0,0,1 ];
    };

// INITIALIZE GL FOR A WEBGL CANVAS:

   function initGL(canvas) {
       var gl;

       try {
          gl = canvas.getContext("webgl") ||
               canvas.getContext("experimental-webgl");
          gl.viewportWidth = canvas.width;
          gl.viewportHeight = canvas.height;
          gl.clearColor(0.0, 0.0, 0.0, 0.0);
          gl.enable(gl.DEPTH_TEST);
       } catch (e) {
          alert("Could not initialise WebGL.");
       }

       return gl;
   }

// COMPILE A SHADER (EITHER VERTEX OR FRAGMENT):

   function createAndCompileShader(canvas, src, type) {
      var gl = canvas.gl;
      var shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
         alert(gl.getShaderInfoLog(shader));
      return shader;
   }

// FETCH THE STRING CONTENTS OF AN HTML ELEMENT

   function getString(element) {
      var str = "";
      for (var k = element.firstChild ; k ; k = k.nextSibling)
         if (k.nodeType == 3)
            str += k.textContent;
      return str;
   }

// CREATE A SHADER PROGRAM, GIVEN THE ID OF AN HTML ELEMENT WITH FRAGMENT SHADER CODE:

   function createShaderProgram(canvas, fragmentShaderId, vertexShaderId) {
      var gl = canvas.gl;

      // GET THE FRAGMENT SHADER STRING FROM A DOCUMENT SCRIPT:

      var fragmentShaderStr = "precision mediump float;" +
                           getString(document.getElementById(fragmentShaderId));

      /*i add this to enable customized vertex shader :)*/
      var _vertexShaderStr;
      if(vertexShaderId !== undefined){
        _vertexShaderStr = getString(document.getElementById(vertexShaderId));
      }else{
        _vertexShaderStr = vertexShaderStr;
      }

      // COMPILE VERTEX AND FRAGMENT SHADERS, THEN LINK THEM INTO A SHADER PROGRAM:

      var vertexShader   = createAndCompileShader(canvas, _vertexShaderStr  , gl.VERTEX_SHADER);
      var fragmentShader = createAndCompileShader(canvas, fragmentShaderStr, gl.FRAGMENT_SHADER);

      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (! gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
         alert("Could not initialise shaders");

      // FIND THE LOCATIONS OF THE DEFAULT SHADER PROGRAM ATTRIBUTES:

      shaderProgram.vertexPositionAttribute =
          gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.vertexNormalAttribute =
          gl.getAttribLocation(shaderProgram, "aVertexNormal");
      gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

      shaderProgram.vertexUVAttribute =
          gl.getAttribLocation(shaderProgram, "aVertexUV");
      gl.enableVertexAttribArray(shaderProgram.vertexUVAttribute);

      shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
      shaderProgram.oMatrixUniform = gl.getUniformLocation(shaderProgram, "uOMatrix");
      shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

      // PREPARE TO CREATE THE LOCATIONS FOR THE SHADER'S OTHER ATTRIBUTES:

      shaderProgram.uniformLocations = [];

      shaderProgram.fragmentShaderStr = fragmentShaderStr;

      return shaderProgram;
   }

// START WEBGL:

   function glStart() {
       startTime = (new Date).getTime();

       // INITIALIZE ALL THE WEBGL CANVASES IN THE DOC:

       var c = document.getElementsByTagName("canvas");
       for (var n = 0 ; n < c.length ; n++) {

          // ONLY PROCESS A CANVAS IF ITS "data-render" TAG IS SET TO "gl":

          if (c[n].getAttribute("data-render") == "gl") {
             var canvas = c[n];

             // ADD THIS CANVAS TO THE LIST OF WEBGL CANVASES IN THE DOC:

             glCanvases.push(canvas);

             canvas.gl = initGL(canvas);

             canvas.handle = window[canvas.id];
             canvas.handle.canvas = canvas;
             canvas.handle.objects = [];

             // DEFINE A FUNCTION FOR ADDING A 3D OBJECT TO THE CANVAS:

             canvas.handle.addObject = function(vertArray, fragmentShaderId) {

                // ADD THIS OBJECT TO THE LIST OF 3D OBJECTS IN THIS CANVAS:

                var obj = [];
                this.objects.push(obj);

                // DEFINE OBJECT'S MATRIX, VERTEX BUFFER AND SHADER PROGRAM:

                obj.matrix = identity();
                obj.vertexBuffer = createVertexBuffer(this.canvas.gl, vertArray);
                obj.shaderProgram = createShaderProgram(this.canvas, fragmentShaderId);

                // PARSE THE FRAGMENT SHADER TO GET NAMES+TYPES OF UNIFORM VARIABLES:

                obj.uniformNames = [];
                obj.uniformTypes = [];
                obj.uniformValues = [];

                /*html has this child thing raw haha*/
                function skipSpace(str, j) {
                   for ( ; str.substring(j, j+1) == " " ; j++) ;
                   return j;
                }

                var sProgram = obj.shaderProgram;
                var str = sProgram.fragmentShaderStr;

                for (var i = 0 ; i < str.length ; i++) {

                   // PARSE ONE UNIFORM VARIABLE IN SHADER TO GET ITS TYPE AND NAME:

                   var j = str.indexOf("uniform", i);
                   if (j == -1)
                      break;

                   j = skipSpace(str, j + "uniform".length);
                   var k = str.indexOf(" ", j);
                   var uType = str.substring(j, k);

                   k = skipSpace(str, k);
                   var l0 = str.indexOf(";", k);
                   var l1 = str.indexOf(" ", k);
                   var l = l0 == -1 ? l1 : l1 == -1 ? l0 : Math.min(l0, l1);
                   var uName = str.substring(k, l);

                   var m = uName.indexOf("[");
                   if (m >= 0) {
                      uName = uName.substring(0, m);
                      uType += "[]";
                   }

                   // SAVE TYPE, NAME AND DEFAULT VALUE OF THIS UNIFORM VARIABLE:
                   /* super weird parsing, i have no idea what's going on */
                   obj.uniformTypes.push(uType);
                   obj.uniformNames.push(uName);
                   obj.uniformValues.push(
                      uType == "vec2"    ? [0,0]
                    : uType == "vec3"    ? [0,0,0]
                    : uType == "vec4"    ? [0,0,0,0]
                    : uType == "mat4"    ? identity()
                    : uType == "float[]" ? [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    : 0);

                   // RECORD THE LOCATION OF THIS VARIABLE IN THE SHADER PROGRAM:

                   sProgram.uniformLocations[uName] =
                      this.canvas.gl.getUniformLocation(sProgram, uName);

                   i = l + 1;
                }

                // GIVEN THE NAME OF A UNIFORM VARIABLE, SET ITS VALUE FOR THIS OBJECT:

                obj.setUniform = function(name, value) {
                   for (var i = 0 ; i < this.uniformNames.length ; i++)
                      if (this.uniformNames[i] == name) {
                         this.uniformValues[i] = value;
                         break;
                      }
                }
             }

             // INIT THE CANVAS'S EVENT HANDLERS, THEN CALL THE USER'S SETUP FUNCTION:

             initEventHandlers(canvas);

             canvas.handle.setup();
          }
       }

       // START THE ANIMATION LOOP:

       var tick = function() {

          // GET THE TIME IN SECONDS SINCE THE PAGE LOADED.

          time = ((new Date).getTime() - startTime) / 1000;

	  // UPDATE ALL CANVASES AND THEN DRAW THEM.

          for (var n = 0 ; n < glCanvases.length ; n++) {
             glCanvases[n].handle.update();
             drawScene(glCanvases[n]);
          }

	  // DO NEXT ANIMATION FRAME.

          requestAnimationFrame(tick);
       };

       tick();
   }

// INITIALIZE RESPONSE BEHAVIOR TO USER MOUSE INPUT:

   function initEventHandlers(canvas)
   {
      canvas.onmousedown = function(event) { // Mouse pressed
         this.handle.mousePressed = true;
	 moveMouse(this.handle, event);
      }
      canvas.onmouseup = function(event) {   // Mouse released
         this.handle.mousePressed = false;
      }
      canvas.onmousemove = function(event) { // Mouse moved
	 moveMouse(this.handle, event);
      }

      function moveMouse(handle, event) {
         var x = event.clientX;
         var y = event.clientY;
         var rect = event.target.getBoundingClientRect();
         if ( rect.left <= x && x <= rect.right &&
              rect.top  <= y && y <= rect.bottom ) {
            handle.mouseX = x - rect.left;
            handle.mouseY = y - rect.top;
         }
      };
   }

// CREATE THE GL VERTEX BUFFER FOR ONE VERTEX ARRAY:

   function createVertexBuffer(gl, vertArray) {
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertArray), gl.STATIC_DRAW);

      vertexBuffer.positionElementCount = 3;
      vertexBuffer.normalElementCount   = 3;
      vertexBuffer.uvElementCount       = 2;

      /*it's just like telling the computer how to chop the array*/
      vertexBuffer.positionOffset = 0 * Float32Array.BYTES_PER_ELEMENT;
      vertexBuffer.normalOffset   = 3 * Float32Array.BYTES_PER_ELEMENT;
      vertexBuffer.uvOffset       = 6 * Float32Array.BYTES_PER_ELEMENT;
      vertexBuffer.stride         = 8 * Float32Array.BYTES_PER_ELEMENT;

      vertexBuffer.numItems = vertArray.length / 8;
      return vertexBuffer;
   }

// DRAW ONE WEBGL CANVAS FOR THIS ANIMATION FRAME

   function drawScene(canvas) {
      var gl = canvas.gl;
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      for (var n = 0 ; n < canvas.handle.objects.length ; n++)
         drawObject(gl, canvas.handle.objects[n]);
   }

// DRAW A SINGLE OBJECT OF A WEBGL CANVAS

   function drawObject(gl, obj) {
      var sProgram = obj.shaderProgram;
      var vBuffer = obj.vertexBuffer;

      gl.useProgram(sProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

      // SET VALUES FOR THIS FRAME FOR ALL DEFAULT UNIFORMS:

      gl.vertexAttribPointer( sProgram.vertexPositionAttribute,
                              vBuffer.positionElementCount,
                              gl.FLOAT,
                              false,
                              vBuffer.stride,
                              vBuffer.positionOffset
                              );
      gl.vertexAttribPointer( sProgram.vertexNormalAttribute,
                              vBuffer.normalElementCount,
                              gl.FLOAT,
                              false,
                              vBuffer.stride,
                              vBuffer.normalOffset
                              );
      gl.vertexAttribPointer( sProgram.vertexUVAttribute,
                              vBuffer.uvElementCount,
                              gl.FLOAT,
                              false,
                              vBuffer.stride,
                              vBuffer.uvOffset
                              );
      gl.uniformMatrix4fv(sProgram.pMatrixUniform, false, perspective(50));
      gl.uniformMatrix4fv(sProgram.oMatrixUniform, false, obj.matrix);
      gl.uniformMatrix4fv(sProgram.nMatrixUniform, false, normalMatrix(obj.matrix));

      // SET THE VALUES FOR THIS FRAME FOR ALL USER DEFINED UNIFORMS:

      for (var i = 0 ; i < obj.uniformNames.length ; i++) {
         var name = obj.uniformNames[i];
         var type = obj.uniformTypes[i];
         var val  = obj.uniformValues[i];
         var loc  = sProgram.uniformLocations[name];

	 // FIND THE RIGHT GL FUNCTION TO SET THIS TYPE OF UNIFORM VARIABLE.
   /* what's going on???*/
         switch (type) {
	 case "float"  : gl.uniform1f       (loc,        val); break;
         case "float[]": gl.uniform1fv      (loc,        val); break;
         case "vec2"   : gl.uniform2fv      (loc,        val); break;
         case "vec3"   : gl.uniform3fv      (loc,        val); break;
         case "vec4"   : gl.uniform4fv      (loc,        val); break;
         case "mat4"   : gl.uniformMatrix4fv(loc, false, val); break;
         }
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vBuffer.numItems);
   }

// CREATE A PARAMETRIC SURFACE, GIVEN A USER DEFINED PARAMETRIC FUNCTION.
// DESIRED STEP SIZE IN U AND V ARE du AND dv, RESPECTIVELY:

   function createParametric(nu, nv, f) {
      var du = 1 / nu;
      var dv = 1 / nv;
      var vertices = [];

      // RETURN BOTH POINT AND NORMAL AT THIS [u,v]:

      function p_n(u, v) {

         // USER'S FUNCTION f MUST EVALUATE TO AN [x,y,z] POINT:

         u = Math.max(0, Math.min(1, u));
         v = Math.max(0, Math.min(1, v));
         var p = f(u, v);

	 // TO COMPUTE NORMAL VECTOR:
	 // APPROXIMATE THE TWO TANGENT VECTORS BY FINITE DIFFERENCING,
	 // THEN TAKE THEIR CROSS PRODUCT.
   /* omg cross product to calculate the normal! */
         var pu = f(u+du/100, v);
	 var ux = pu[0] - p[0], uy = pu[1] - p[1], uz = pu[2] - p[2];

         var pv = f(u, v+dv/100);
	 var vx = pv[0] - p[0], vy = pv[1] - p[1], vz = pv[2] - p[2];

	 var x = uy * vz - uz * vy;
	 var y = uz * vx - ux * vz;
	 var z = ux * vy - uy * vx;
	 var r = Math.sqrt(x*x + y*y + z*z);

	 // RETURN BOTH THE POINT AND THE NORMAL:

	 return [p[0], p[1], p[2], x/r, y/r, z/r];
      }

      // ADD A SINGLE QUAD, COVERING PARAMETRIC RANGE [u,v]...[u+du,v+dv]:

      /* ken says quad is ineffcient?*/
      function addQuad(u, v, a, b, c, d) {

         // EACH VERTEX IS: x,y,z, nx,ny,nz, u,v

	 vertices.push(a[0],a[1],a[2], a[3],a[4],a[5], u   , v   );
	 vertices.push(b[0],b[1],b[2], b[3],b[4],b[5], u+du, v   );
	 vertices.push(c[0],c[1],c[2], c[3],c[4],c[5], u+du, v+dv);
	 vertices.push(d[0],d[1],d[2], d[3],d[4],d[5], u   , v+dv);
	 vertices.push(a[0],a[1],a[2], a[3],a[4],a[5], u   , v   );
      }

      // THE FOLLOWING WOULD BE MORE EFFICIENT IF IT
      // CREATED TRIANGLE STRIPS IN THE INNER LOOP:

      for (var v = 0 ; v < 1 ; v += dv)
         for (var u = 0 ; u < 1 ; u += du)
            addQuad(u,v, p_n(u, v), p_n(u+du,v), p_n(u+du,v+dv), p_n(u,v+dv));

      return vertices;
   }

// CREATE A CUBE GEOMETRY:

   function createCube() {
      var vertices = [];

      function addFace(c, a, b) {
         var x = c[0], y = c[1], z = c[2];
         var A = a[0], B = a[1], C = a[2];
         var D = b[0], E = b[1], F = b[2];

         // EACH VERTEX IS: x,y,z, nx,ny,nz, u,v

         vertices.push(x-A-D, y-B-E, z-C-F, x,y,z, 0,0);
         vertices.push(x+A-D, y+B-E, z+C-F, x,y,z, 1,0);
         vertices.push(x+A+D, y+B+E, z+C+F, x,y,z, 1,1);
         vertices.push(x-A+D, y-B+E, z-C+F, x,y,z, 0,1);
         vertices.push(x-A-D, y-B-E, z-C-F, x,y,z, 0,0);
      }

      var xn = [-1,0,0], yn = [0,-1,0], zn = [0,0,-1];
      var xp = [ 1,0,0], yp = [0, 1,0], zp = [0,0, 1];

      addFace(xn, yn, zn);
      addFace(xp, yp, zp);
      addFace(yn, zn, xn);
      addFace(yp, zp, xp);
      addFace(zn, xn, yn);
      addFace(zp, xp, yp);

      return vertices;
   }


},{}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/index.js":[function(require,module,exports){
var check  = require('./check.js');
var Mat4 = require('./mat4.js');
var multiply = require('./operate.js').multiply;
// var eye1 = check.eye1;
// var eye2 = check.eye2;
//var checking = check.checking;
require('./gl.js');

canvas1.setup = function() {
  this.addObject(createParametric(24,12,sph), 'norm');
  //this.addObject(createCube(), 'fs_phong');
  this.addObject(createParametric(24,12,sph), 'fs_phong');
}

var frameCount = 0;

canvas1.update = function() {
  frameCount++;

   var cy = .5*Math.cos(time);
   var sy = .5*Math.sin(time);
   //console.log(cy)
   var theta = frameCount / 10;

   var obj0 = this.objects[0];
   var obj1 = this.objects[1];

   //let's do rotation!!!!!
   var tem3 = Mat4();
   var tem5 = Mat4();
   if(check.checking){
     // var tranM = Mat4.translate(check.eye1[0], check.eye1[1], 0);
     // //var roM1 = Mat4.rotateX(theta);
     // var roM2 = Mat4.rotateZ(theta);
     // var scM = Mat4.scale(0.1, 0.1, 0.1);

     // var tem = multiply(tranM, roM2);
     // var tem2 = multiply(tem, scM);
     // //var tem3 = multiply(tranM, scM);
     obj0.matrix = [.1,0,0,0, 0,.1,0,0, 0,0,.1,0, check.eye1[0],-check.eye1[1],0,1];
     // //obj0.matrix = tem2;
     // obj0.matrix = multiply(tranM, scM);
     // obj1.matrix = [
     // .1*cy,0,.1*sy,0,
     // 0,.1,0,0,
     // -.1*sy,0,.1*cy,0,
     // check.eye1[0],-check.eye1[1],0,1
     // ];
     obj1.matrix = [.1,0,0,0, 0,.1,0,0, 0,0,.1,0, check.eye2[0],-check.eye2[1],0,1];

    obj1.setUniform('p', [.1,.0,0, .9,.0,0, 1,1,1,20]);
    obj1.setUniform('lDir', [.57,.57,.57]);
    // obj1.setUniform('rgb', [.5,.5,1]);

     // var tranM2 = Mat4.translate(check.eye2[0], check.eye2[1], 0);
     // var tem4 = multiply(tranM2, roM2);
     // var tem5 = multiply(tem4, scM);
     //obj1.matrix = tem5;


   }

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


},{"./check.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/check.js","./gl.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/gl.js","./mat4.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/mat4.js","./operate.js":"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/operate.js"}],"/Users/karen/Documents/my_project/webGL_sketch/hw8_webGL/mat4.js":[function(require,module,exports){
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
