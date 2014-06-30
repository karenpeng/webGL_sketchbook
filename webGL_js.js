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
// // 	requestAnimationFrame( render );

// // 	cube.rotation.x += 0.1;
// // 	cube.rotation.y += 0.1;

// // 	renderer.render( scene, camera );
// // }
// // render();