var exec = require('child_process').exec;

module.exports = function(points,imgsrc,imgdest){
  this.script = '';
  this.points = points;
  this.imgsrc = imgsrc;
  this.imgdest = imgdest;
  this.generateScript();
}

module.exports.prototype.generateScript = function () {

  var width = this.points[1].X - this.points[0].X;
  var height = this.points[2].Y - this.points[1].Y;

  this.script = "convert " + this.imgsrc + " -matte -virtual-pixel transparent -distort Perspective '"
  + this.points[0].X + "," + this.points[0].Y + " " + this.points[0].X + "," + this.points[0].Y +"   "
  + this.points[1].X + "," + this.points[1].Y + " " + this.points[1].X + "," + this.points[1].Y +"   "
  + this.points[2].X + "," + this.points[2].Y + " " + this.points[1].X + "," + this.points[2].Y +"   "
  + this.points[3].X + "," + this.points[3].Y + " " + this.points[0].X + "," + this.points[3].Y + "' " + "-"
  + ' | convert - -flip - | convert - -crop ' + width + 'x' +  height + '+' + this.points[0].X + '+' + this.points[0].Y
  + ' ' + this.imgdest;
  console.log(this.script);
};

module.exports.prototype.fakeprocess = function (callback) {
  exec('convert tmp/image.png -flip tmp/newimage.png ',callback);
};

module.exports.prototype.process = function (callback) {
  exec(this.script,callback);
};
