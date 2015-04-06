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

