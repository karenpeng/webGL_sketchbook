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