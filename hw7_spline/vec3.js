module.exports = Vec3;

function Vec3(x, y, z){
  return new Float32Array([x || 0, y || 0, z || 0]);
}