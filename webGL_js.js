// // set the scene size
// var WIDTH = 400,
//     HEIGHT = 300;

// // set some camera attributes
// var VIEW_ANGLE = 45,
//     ASPECT = WIDTH / HEIGHT,
//     NEAR = 0.1,
//     FAR = 10000;

// // get the DOM element to attach to
// // - assume we've got jQuery to hand
// var $container = $('#container');

// var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
// camera.position.z = 500;

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );

// var scene = new THREE.Scene();
// renderer.setSize(WIDTH, HEIGHT);

// $container.append(renderer.domElement);

// // set up the sphere vars
// var radius = 50, segments = 16, rings = 16;

// // create a new mesh with sphere geometry -
// // we will cover the sphereMaterial next!
// var sphere = new THREE.Mesh(
//    new THREE.SphereGeometry(radius,
//    segments,
//    rings),

//    sphereMaterial);

// // add the sphere to the scene
// scene.add(sphere);

// // create the sphere's material
// var sphereMaterial = new THREE.MeshLambertMaterial(
// {
//   // a gorgeous red.
//   color: 0xCC0000
// });

// // create a point light
// var pointLight = new THREE.PointLight( 0xFFFFFF );

// // set its position
// pointLight.position.x = 10;
// pointLight.position.y = 50;
// pointLight.position.z = 130;

// // add to the scene
// scene.add(pointLight);

// renderer.render( scene, camera );

// // function render(){
// // requestAnimationFrame( render );

// // cube.rotation.x += 0.1;
// // cube.rotation.y += 0.1;

// // renderer.render( scene, camera );
// // }
// // render();

//Get A WebGL context
// var canvas = document.getElementById("myCanvas");
// var gl = canvas.getContext("experimental-webgl");

// // setup a GLSL program
// var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
// var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
// var program = createProgram(gl, [vertexShader, fragmentShader]);
// gl.useProgram(program);

// // look up where the vertex data needs to go.
// var positionLocation = gl.getAttribLocation(program, "a_position");

// // Create a buffer and put a single clipspace rectangle in
// // it (2 triangles)
// var buffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// gl.bufferData(
//   gl.ARRAY_BUFFER,
//   new Float32Array([-1.0, -1.0,
//     1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
//     1.0, -1.0,
//     1.0, 1.0
//   ]),
//   gl.STATIC_DRAW);
// gl.enableVertexAttribArray(positionLocation);
// gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// // draw
// gl.drawArrays(gl.TRIANGLES, 0, 6);

// var gl; // A global variable for the WebGL context

// function start() {
//   var canvas = document.getElementById("myCanvas");

//   gl = initWebGL(canvas); // Initialize the GL context

//   // Only continue if WebGL is available and working

//   if (gl) {
//     gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black, fully opaque
//     gl.enable(gl.DEPTH_TEST); // Enable depth testing
//     gl.depthFunc(gl.LEQUAL); // Near things obscure far things
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
//   }
// }

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
  0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var render = function () {
  requestAnimationFrame(render);

  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

  renderer.render(scene, camera);
};

render();