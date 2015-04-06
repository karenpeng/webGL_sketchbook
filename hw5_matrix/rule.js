function Rule(_a, _b) {
  this.a = _a;
  this.b = _b;
}

Rule.prototype.getA = function () {
  return this.a;
}

Rule.prototype.getB = function () {
  return this.b;
}

module.exports = Rule;