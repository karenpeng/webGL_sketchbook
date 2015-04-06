function Lsystem(axiom, arr) {
  this.sentence = axiom;
  this.ruleset = arr;
  this.generation = 0;
}

Lsystem.prototype.generate = function () {

  for (var i = 0; i < this.sentence.length; i++) {
    var cur = this.sentence[i];
    var replace = '' + cur;
    for (var j = 0; j < this.ruleset.length; j++) {
      var a = this.ruleset[j].getA();
      if (a === cur) {
        replace = this.ruleset[j].getB();
        break;
      }
    }
    console.log('here')
    this.sentence += replace;
    console.log('there')
  }
  //console.log(this.sentence);
  this.generation++;
}

Lsystem.prototype.getSentence = function () {
  return this.sentence;
}

Lsystem.prototype.getGeneration = function () {
  return this.generation;
}

module.exports = Lsystem;